import cluster from "node:cluster";
import { Shard } from "discord.js";

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
