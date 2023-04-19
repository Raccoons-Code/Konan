/* eslint-disable no-await-in-loop */
import { Shard } from "discord.js";
import cluster from "node:cluster";
import sharding from ".";

const actions = {
  getShard(message: any, shard: Shard) {
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
  },

  async getTotalShards(message: any, shard: Shard) {
    message.fromWorker = cluster.worker?.id;
    message.replied = true;
    message.data = {
      totalShards: sharding.totalShards,
    };
    message.replyShard = shard.id;
    delete message.action;
    await shard.send(message);
    return;
  },

  getTotalWorkers(message: any) {
    message.fromWorker = cluster.worker?.id;
    cluster.worker?.send(message);
    return;
  },

  killShard(message: any) {
    const shardId = message.data.shardId;
    if (!sharding.shards.has(shardId)) return;
    sharding.shards.get(shardId)?.kill();
    sharding.shards.delete(shardId);
    console.log(`Shard ${shardId} on worker ${cluster.worker?.id} killed.`);
    return;
  },

  async respawnAll(message: any) {
    await sharding.respawnAll();

    message.action = "ready";
    message.origin = "worker";

    cluster.worker?.send(message);
    return;
  },

  async setShardCount(message: any) {
    if (!message?.data) return;

    sharding.totalShards = message.data.totalShards;
    sharding.shardList = <number[]>message.data.shardList ?? sharding.shardList;

    const promises = [];

    for (const shard of sharding.shards.values()) {
      promises.push(shard.send(message));
    }

    await Promise.all(promises);
    return;
  },
};

export default actions;

export type ActionType = keyof typeof actions;

export const actionTypes = <ActionType[]>Object.keys(actions);
