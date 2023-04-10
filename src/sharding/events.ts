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

    if (message.replyWorker) {
      cluster.worker?.send(message, () => null);
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
      cluster.worker?.send(message, () => null);
      return;
    }

    if (typeof message.toShard === "number") {
      message.fromShard = shard.id;
      const toShard = message.toShard;
      delete message.toShard;
      await sharding.shards.get(toShard)?.send(message);
    } else {
      await sharding.broadcast(message);
    }
  };

  shard.on("message", listener);

  process.on("message", listener);
});
