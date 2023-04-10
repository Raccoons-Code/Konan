import { Shard } from "discord.js";
import cluster from "node:cluster";
import sharding, { shards } from ".";
import { BaseProcessMessage } from "../@types";
import TopggShardingAutoposter from "../modules/Topgg/shardingAutoposter";

const topggShardingAutoposter = new TopggShardingAutoposter();

sharding.on("shardCreate", async function (shard) {
  shards.set(shard.id, shard);

  console.log(`Launched shard ${shard.id}`);

  shard.once("ready", async function () {
    if (sharding.shards.size === sharding.totalShards) {
      if (!topggShardingAutoposter.started)
        topggShardingAutoposter.start();
    }
  });

  const listener = async function (message: BaseProcessMessage) {
    if (!message?.id) return;

    if (message.action === "getTotalWorkers") {
      message.fromWorker = cluster.worker?.id;
      cluster.worker?.send(message);
      return;
    }

    if (message.action === "getShard") {
      if (sharding.shards.has(message.toShard!)) {
        delete message.action;
        message.replied = true;
        message.replyWorker = message.fromWorker;
        message.fromWorker = cluster.worker?.id;
        message.replyShard = message.fromShard;
        message.fromShard = shard.id;
        delete message.toShard;
        message.data = {
          workerId: cluster.worker?.id,
        };
        cluster.worker?.send(message);
      }
      return;
    }

    if (message.replyWorker) {
      message.fromWorker = cluster.worker?.id;
      cluster.worker?.send(message);
      return;
    }

    if (typeof message.replyShard === "number") {
      const replyShard = message.replyShard;
      delete message.replyShard;
      await sharding.shards.get(replyShard)?.send(message);
      return;
    }

    if (message.toWorker) {
      message.fromWorker = cluster.worker?.id;
      cluster.worker?.send(message);
      return;
    }

    if (typeof message.toShard === "number") {
      if (sharding.shards.has(message.toShard)) {
        const toShard = message.toShard;
        delete message.toShard;
        await sharding.shards.get(toShard)?.send(message);
      } else {
        const workerId = await fetchShardfromClusters(shard, message.toShard);
        message.toWorker = workerId;
        message.fromWorker = cluster.worker?.id;
        cluster.worker?.send(message);
      }
      return;
    } else {
      const promises = [];

      for (const other of sharding.shards.values()) {
        promises.push(other.send(message));
      }

      const totalShards = (sharding.totalShards as number);

      if (sharding.shards.size < totalShards) {
        if (!message.fromWorker) {
          message.fromWorker = cluster.worker?.id;
          for (let i = 0; i < totalShards; i++) {
            if (!sharding.shards.has(i)) {
              promises.push(fetchShardfromClusters(shard, i)
                .then(workerId => {
                  message.toShard = i;
                  message.toWorker = workerId;
                  cluster.worker?.send(message);
                }));
            }
          }
        }
      }

      await Promise.all(promises);
    }
  };

  shard.on("message", listener);

  process.on("message", listener);
});

function fetchShardfromClusters(shard: Shard, shardId: number) {
  return new Promise<number>((resolve, _reject) => {
    const id = Date.now() / 2;

    const listener = function (message: any) {
      if (message?.id === id) {
        if (message.data?.workerId) {
          shard.setMaxListeners((shard.getMaxListeners() || 1) - 1);

          process.setMaxListeners((process.getMaxListeners() || 1) - 1);

          resolve(message.data.workerId);
        }
      }
    };

    shard.setMaxListeners(shard.getMaxListeners() + 1);

    process.setMaxListeners(process.getMaxListeners() + 1);

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
