import { AttachmentBuilder, Message, Status } from "discord.js";
import ms from "ms";
import client from "../../client";
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

    const pingShards: (number | string)[][] = [[
      "Shard",
      "Status",
      "Ping",
      "Guilds",
      "Channels",
      "Emojis",
      "Users",
      "Interactions",
      "Uptime",
    ]];

    const data = await client.shard.broadcastEval(client => ({
      channels: client.channels.cache.size,
      emojis: client.emojis.cache.size,
      guilds: client.guilds.cache.size,
      interactions: client.interactions,
      readyAt: client.readyAt,
      readyTimestamp: client.readyTimestamp,
      uptime: client.uptime,
      users: client.users.cache.size,
      voiceAdapters: client.voice.adapters.size,
      wsPing: client.ws.ping,
      wsStatus: client.ws.status,
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];

      const shard = client.ws.shards.at(i);

      pingShards.push([
        shard?.id ?? "",
        Status[shard?.status ?? NaN] ?? "",
        shard?.ping ?? "",
        value.guilds,
        value.channels,
        value.emojis,
        value.users,
        value.interactions,
        ms(Date.now() - value.readyTimestamp!),
      ]);
    }

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
