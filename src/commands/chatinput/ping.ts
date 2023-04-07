import { AttachmentBuilder, Message, Status } from "discord.js";
import { env } from "process";
import client, { appStats } from "../../client";
import Command from "../../structures/Command";
import Bytes from "../../util/Bytes";
import ParseMs from "../../util/ParseMs";
import { makeMultiTable } from "../../util/utils";

export default class extends Command {
  [k: string]: any;

  constructor() {
    super({
      name: "ping",
    });
  }

  async execute(message: Message) {
    const sent = await message.reply("Pong!");

    if (message.args?.length) {
      if (!await this[message.args[0].toLowerCase()]?.(message, sent)) {
        return;
      }
    }

    const ping = sent.createdTimestamp - (message.editedTimestamp ?? message.createdTimestamp);

    await sent.edit(`Pong! \`API: ${client.ws.ping}ms\`, \`BOT: ${ping}ms\``);

    return;
  }

  async shards(_message: Message, sent: Message) {
    if (!client.shard) return 1;

    const promises = [
      appStats.fetch(),
    ];

    const pingShards: (string | { toString(): string })[][] = [];

    const shardsData = await client.shard.broadcastEval(client => ({
      stats: client.appStats,
      readyAt: client.readyAt,
      readyTimestamp: client.readyTimestamp,
      uptime: client.uptime,
      wsPing: client.ws.ping,
      wsStatus: client.ws.status,
    }));

    let totalMemory = 0;
    let totalPing = 0;

    for (const data of shardsData) {
      const shard = client.ws.shards.get(data.stats.shardId);

      totalMemory += data.stats.memoryUsage.heapUsed;
      totalPing += shard?.ping ?? data.wsPing;

      pingShards[data.stats.shardId === appStats.shardId ? "unshift" : "push"](
        (env.PM2_INSTANCE_ID ? [env.PM2_INSTANCE_ID] : <any>[]).concat([
          data.stats.shardId,
          Status[shard?.status ?? data.wsStatus] ?? "",
          new ParseMs(data.uptime!),
          `${shard?.ping ?? data.wsPing}ms`,
          new Bytes(data.stats.memoryUsage.heapUsed),
          data.stats.interactions,
          data.stats.messages,
          data.stats.users,
          data.stats.emojis,
          data.stats.channels,
          data.stats.guilds,
        ]));
    }

    await Promise.all(promises);

    const total = [
      "Total",
      `${shardsData.length}/${appStats.shards}`,
      "",
      `~${Math.floor(totalPing / shardsData.length)}ms`,
      new Bytes(totalMemory),
      appStats.totalInteractions,
      appStats.totalMessages,
      appStats.totalUsers,
      appStats.totalEmojis,
      appStats.totalChannels,
      appStats.totalGuilds,
    ];

    pingShards.unshift([
      "Shard",
      "Status",
      "Uptime",
      "Ping",
      "Memory",
      "Interactions",
      "Messages",
      "Users",
      "Emojis",
      "Channels",
      "Servers",
    ]);

    if (env.PM2_INSTANCE_ID) {
      pingShards[0].unshift("Cluster");
      total.unshift("Total");
      total[1] = total[2];
      total[2] = "";
    }

    pingShards.push(total);

    await sent.edit({
      files: [
        new AttachmentBuilder(Buffer.from(makeMultiTable(pingShards), "utf8"), {
          name: "ping.r",
        }),
      ],
    });

    return;
  }
}
