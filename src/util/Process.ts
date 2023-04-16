import { env } from "node:process";
import { BaseProcessMessage, MultiProcessMessage, SingleProcessMessage } from "../@types";
import client, { appStats } from "../client";

export function fetchProcessResponse<
  D,
  M extends SingleProcessMessage = SingleProcessMessage
>(message: M): Promise<BaseProcessMessage & { data: D }>;
export function fetchProcessResponse<
  D,
  M extends MultiProcessMessage = MultiProcessMessage
>(message: M): Promise<(BaseProcessMessage & { data: D })[]>;
export async function fetchProcessResponse<M extends BaseProcessMessage>(message: Partial<M>) {
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
    const received: M[] = [];

    const originId = message.id;

    const res = await fetchProcessResponse<{ totalShards: number }>({
      action: "getTotalShards",
      toShard: appStats.shardId,
    });

    if (appStats.totalShards !== res.data.totalShards) {
      client.options.shardCount = res.data.totalShards;
      appStats.totalShards = client.options.shardCount;
      env.SHARD_COUNT = `${appStats.totalShards}`;
    }

    for (let i = 0; i < res.data.totalShards; i++) {
      const id = Date.now() + i;

      promises.push(waitProcessResponse<M>(msg => {
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

    return Promise.all(promises).catch(() => received) as Promise<M[]>;
  }
}

export function waitProcessResponse<T>(callback: (message: T) => boolean | void): Promise<T> {
  process.setMaxListeners(process.getMaxListeners() + 1);

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      process.removeListener("message", listener);
      process.setMaxListeners((process.getMaxListeners() || 1) - 1);

      reject(Error("Timeout"));
    }, 5000);

    const listener = function (message: any) {
      if (message?.replied && callback(message)) {
        clearTimeout(timeout);

        process.removeListener("message", listener);
        process.setMaxListeners((process.getMaxListeners() || 1) - 1);

        if (message.error) {
          reject(Error(message.error));
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
