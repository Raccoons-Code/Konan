import { Shard } from "discord.js";
import cluster from "node:cluster";
import sharding from ".";
import { BaseProcessMessage, MultiProcessMessage } from "../@types";

export function fetchShardingProcessMessage<
  D,
  M extends MultiProcessMessage = MultiProcessMessage
>(message: M): Promise<(BaseProcessMessage & { data: D })[]>;
export function fetchShardingProcessMessage<M extends BaseProcessMessage>(message: Partial<M>) {
  if (!message.id) {
    message.id = Date.now();
  }

  if (typeof message.fromWorker !== "number") {
    message.fromWorker = cluster.worker?.id;
  }

  const promises = [];
  const received: M[] = [];

  const originId = message.id;

  for (let i = 0; i < (sharding.totalShards as number); i++) {
    const id = Date.now() + i;

    promises.push(waitShardingProcessResponse<M>(msg => {
      if (id === msg.id && msg.fromShard === i) {
        msg.id = originId;
        received.push(msg);
        return true;
      }
    }));

    message.id = id;
    message.toShard = i;

    cluster.worker?.send(message);
  }

  return Promise.all(promises).catch(() => received) as Promise<M[]>;
}

export function fetchShardfromClusters(shard: Shard, shardId: number) {
  shard.setMaxListeners(shard.getMaxListeners() + 1);
  process.setMaxListeners(process.getMaxListeners() + 1);

  return new Promise<number>((resolve, _reject) => {
    const id = Date.now() / 2;

    const listener = function (message: any) {
      if (message?.id === id) {
        if (message.data?.workerId) {
          shard.removeListener("message", listener);
          shard.setMaxListeners((shard.getMaxListeners() || 1) - 1);
          process.removeListener("message", listener);
          process.setMaxListeners((process.getMaxListeners() || 1) - 1);

          resolve(message.data.workerId);
        }
      }
    };

    shard.on("message", listener);
    process.on("message", listener);

    cluster.worker?.send({
      id,
      action: "getShard",
      origin: "shard",
      toShard: shardId,
      fromWorker: cluster.worker.id,
    });
  });
}

export function waitShardingProcessResponse<T>(callback: (message: T) => boolean | void): Promise<T> {
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
