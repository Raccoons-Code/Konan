import { BaseProcessMessage } from "../@types";
import client, { appStats } from "../client";

process.on("message", async function (message: BaseProcessMessage, _sendHandle) {
  if (!message?.id) return;

  if (message.replied) return;

  if (message.action) {
    const action = actions[<"stats">message.action];

    message.data = await action?.() ?? action;

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
    return appStats.fetch().then(stats => stats.toJSON());
  },
};
