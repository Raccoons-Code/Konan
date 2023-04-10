import { BaseProcessMessage } from "../@types";
import client, { appStats } from "../client";

export function fetchProcessResponse<T extends BaseProcessMessage>(message: Partial<T>) {
  if (!message.id) {
    message.id = Date.now();
  }

  if (typeof message.fromShard !== "number") {
    message.fromShard = appStats.shardId;
  }

  if (typeof message.toShard === "number") {
    const promise = waitProcessMessageById(message.id);

    client.shard?.send(message);

    return promise;
  } else {
    const promises = [];
    const received: T[] = [];

    const originId = message.id;

    for (let i = 0; i < (client.shard?.count ?? 0); i++) {
      const id = Date.now() + i;

      promises.push(waitProcessResponse<T>(msg => {
        if (id === msg.id && msg.fromShard === i) {
          msg.id = originId;
          received.push(msg);
          return true;
        }
      }));

      message.id = id;
      message.toShard = i;

      client.shard?.send(message);
    }

    return Promise.all(promises).catch(() => received);
  }
}

export function waitProcessResponse<T>(callback: (message: T) => boolean | void): Promise<T> {
  process.setMaxListeners(process.getMaxListeners() + 1);

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      process.removeListener("message", listener);
      process.setMaxListeners((process.getMaxListeners() || 1) - 1);

      reject(new Error("Timeout"));
    }, 5000);

    const listener = function (message: any) {
      // if (!message) return;

      if (message?.replied && callback(message)) {
        clearTimeout(timeout);

        process.removeListener("message", listener);
        process.setMaxListeners((process.getMaxListeners() || 1) - 1);

        if (message.error) {
          reject(new Error(message.error));
        }

        resolve(message);
      }

      return;
    };

    process.on("message", listener);
  });
}

export function waitProcessMessageById<T extends BaseProcessMessage>(id: number) {
  return waitProcessResponse<T>(message => message.id === id);
}
