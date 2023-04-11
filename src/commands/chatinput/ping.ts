import { AttachmentBuilder, Message, Status } from "discord.js";
import { Stats } from "../../@types";
import client, { appStats } from "../../client";
import Command from "../../structures/Command";
import Bytes from "../../util/Bytes";
import ParseMs from "../../util/ParseMs";
import { fetchProcessResponse } from "../../util/Process";
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

    const response = await fetchProcessResponse<Stats>({
      action: "stats",
    });

    const pingShards: (string | { toString(): string })[][] = [];

    let totalMemory = 0;
    let totalPing = 0;
    let totalInteractions = 0;
    let totalMessages = 0;
    let totalUsers = 0;
    let totalEmojis = 0;
    let totalChannels = 0;
    let totalGuilds = 0;

    for (const stats of response) {
      totalMemory += stats.data.memoryUsage.heapUsed;
      totalPing += stats.data.wsPing!;
      totalInteractions += stats.data.interactions;
      totalMessages += stats.data.messages;
      totalUsers += stats.data.users;
      totalEmojis += stats.data.emojis;
      totalChannels += stats.data.channels;
      totalGuilds += stats.data.guilds;

      pingShards[stats.data.shardId === appStats.shardId ? "unshift" : "push"]([
        stats.fromWorker!,
        stats.data.shardId,
        Status[stats.data.wsStatus] ?? "",
        new ParseMs(stats.data.uptime!),
        `${stats.data.wsPing}ms`,
        new Bytes(stats.data.memoryUsage.heapUsed),
        stats.data.interactions,
        stats.data.messages,
        stats.data.users,
        stats.data.emojis,
        stats.data.channels,
        stats.data.guilds,
      ]);
    }

    const total = [
      "Total",
      `${response.length}/${appStats.shards}`,
      "",
      "",
      `~${Math.floor(totalPing / response.length)}ms`,
      new Bytes(totalMemory),
      totalInteractions,
      totalMessages,
      totalUsers,
      totalEmojis,
      totalChannels,
      totalGuilds,
    ];

    pingShards.unshift([
      "Cluster",
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
