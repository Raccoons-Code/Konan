import { AttachmentBuilder, Message, Status } from "discord.js";
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
      const fn = this[message.args[0].toLowerCase()];

      if (fn) {
        await fn(sent);
        return;
      }
    }

    const ping = sent.createdTimestamp - (message.editedTimestamp ?? message.createdTimestamp);

    await sent.edit(`Pong! \`API: ${client.ws.ping}ms\`, \`BOT: ${ping}ms\``);

    return;
  }

  async shards(sent: Message) {
    const pingShards: string[][] = [["Shard", "Status", "Ping"]];

    for (const shard of client.ws.shards.values()) {
      pingShards.push([
        `${shard.id}`,
        `${Status[shard.status]}`,
        `${shard.ping}`,
      ]);
    }

    await sent.edit({
      files: [
        new AttachmentBuilder(Buffer.from(makeMultiTable(pingShards), "utf8"), {
          name: "ping.r",
        }),
      ],
    });
  }
}
