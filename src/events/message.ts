import { BaseProcessMessage } from "../@types";
import client, { appStats } from "../client";

process.on("message", async function (message: BaseProcessMessage, _sendHandle) {
  if (!message?.id) return;

  if (message.replied) return;

  if (message.action) {
    const action = actions[<keyof typeof actions>message.action];

    message.data = await action?.(message) ?? action;
    message.replied = true;
    message.replyShard = message.fromShard;
    message.replyWorker = message.fromWorker;
    message.fromShard = appStats.shardId;

    await client.shard?.send(message);
  }
});

const actions = {
  ping() {
    return {
      ping: client.ws.ping,
    };
  },
  async stats() {
    return appStats.toJSON();
  },
  setShardCount(message: BaseProcessMessage<any>) {
    client.options.shardCount = message.data.totalShards;
    client.options.shards = message.data.shardList;
  },
};
