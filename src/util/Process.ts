import { BaseProcessMessage } from "../@types";
import client, { appStats } from "../client";

export function fetchProcessResponse<T extends BaseProcessMessage>(message: Partial<T>): Promise<T[]>;
export function fetchProcessResponse<T extends BaseProcessMessage & { toShard: number }>(message: Partial<T>): Promise<T>;
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
    const received: number[] = [];

    for (let i = 0; i < (client.shard?.count ?? 0); i++) {
      promises.push(waitProcessResponse<BaseProcessMessage>(msg => {
        if (message.id === msg.id) {
          if (!received.includes(msg.fromShard)) {
            received.push(msg.fromShard);
            return true;
          }
        }
      }));
    }

    client.shard?.send(message);

    return Promise.all(promises);
  }
}

export function waitProcessResponse<T>(callback: (message: T) => boolean | void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      process.removeListener("message", listener);

      process.setMaxListeners((process.getMaxListeners() || 1) - 1);

      reject(new Error("Timeout"));
    }, 5000);

    process.setMaxListeners(process.getMaxListeners() + 1);

    const listener = function (message: any) {
      if (!message) return;

      if (callback(message)) {
        clearTimeout(timeout);

        process.removeListener("message", listener);

        process.setMaxListeners((process.getMaxListeners() || 1) - 1);

        if (message.error) {
          reject(new Error(message.error));
        }

        resolve(message);
      }
    };

    process.on("message", listener);
  });
}

export function waitProcessMessageById<T extends BaseProcessMessage>(id: number) {
  return waitProcessResponse<T>(message => message.id === id);
}
