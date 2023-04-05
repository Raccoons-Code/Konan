import { AttachmentBuilder, Message, Status } from "discord.js";
import ms from "ms";
import client, { appStats } from "../../client";
import Command from "../../structures/Command";
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

    const pingShards: (number | string)[][] = [[
      "Shard",
      "Status",
      "Uptime",
      "Ping",
      "Interactions",
      "Messages",
      "Users",
      "Emojis",
      "Channels",
      "Guilds",
    ]];

    const data = await client.shard.broadcastEval(client => ({
      appStats: client.appStats,
      readyAt: client.readyAt,
      readyTimestamp: client.readyTimestamp,
      uptime: client.uptime,
      wsPing: client.ws.ping,
      wsStatus: client.ws.status,
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];

      const shard = client.ws.shards.at(i);

      pingShards.push([
        shard?.id ?? i,
        Status[shard?.status ?? value.wsStatus] ?? "",
        ms(Date.now() - value.readyTimestamp!),
        `${shard?.ping ?? value.wsPing}ms`,
        value.appStats.interactions,
        value.appStats.messages,
        value.appStats.users,
        value.appStats.emojis,
        value.appStats.channels,
        value.appStats.guilds,
      ]);
    }

    await Promise.all(promises);

    pingShards.push([
      "TOTAL",
      appStats.shards,
      "",
      "",
      appStats.totalInteractions,
      appStats.totalMessages,
      appStats.totalUsers,
      appStats.totalEmojis,
      appStats.totalChannels,
      appStats.totalGuilds,
    ]);

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
