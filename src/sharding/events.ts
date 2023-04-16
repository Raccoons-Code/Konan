/* eslint-disable no-await-in-loop */
import cluster from "node:cluster";
import sharding, { shards } from ".";
import { BaseProcessMessage } from "../@types";
import TopggShardingAutoposter from "../modules/Topgg/shardingAutoposter";
import actions, { ActionType, actionTypes } from "./actions";
import { fetchShardfromClusters } from "./utils";

const topggShardingAutoposter = new TopggShardingAutoposter();

sharding.on("shardCreate", async function (shard) {
  shards.set(shard.id, shard);

  console.log("Launched cluster", cluster.worker?.id, "shard", shard.id);

  shard.once("ready", async function () {
    if (sharding.shards.size === sharding.totalShards) {
      if (!topggShardingAutoposter.started)
        topggShardingAutoposter.start();
    }
  });

  const listener = async function (message: BaseProcessMessage) {
    if (!message?.id) return;

    if (message.action) {
      if (actionTypes.includes(<ActionType>message.action)) {
        await actions[<ActionType>message.action](message, shard);
        return;
      }
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
        message.fromWorker ??= cluster.worker?.id;
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
        message.toShard = other.id;
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
