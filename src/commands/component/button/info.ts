import { stripIndents } from "common-tags";
import { ButtonInteraction, calculateShardId, codeBlock, EmbedBuilder, time } from "discord.js";
import { memoryUsage, versions } from "node:process";
import { InfoCustomId } from "../../../@types";
import client, { appStats } from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";
import Bytes from "../../../util/Bytes";
import { CPU_CORES, CPU_MODEL, DJS_VERSION, OS_VERSION, TOTAL_RAM, VERSION } from "../../../util/constants";
import { makeTable } from "../../../util/utils";

const inline = true;

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "info",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const parsedId = <InfoCustomId>JSON.parse(interaction.customId);

    await this[<"app">parsedId.sc]?.(interaction);

    return;
  }

  async app(interaction: ButtonInteraction) {
    const me = interaction.guild?.members.me;
    const user = client.user;

    const iconURL = me?.displayAvatarURL() ?? user?.displayAvatarURL();
    const username = me?.displayName ?? user?.username;

    const heapUsed = memoryUsage().heapUsed;

    const engine = stripIndents(`
      Node : ${versions.node}
    `);

    const library = stripIndents(`
      Discord.js : ${DJS_VERSION}
    `);

    const machine = stripIndents(`
      CPU : ${CPU_MODEL} (${CPU_CORES} cores)
      OS  : ${OS_VERSION}
      RAM : ${new Bytes(heapUsed)} / ${new Bytes(TOTAL_RAM)}
    `);

    const stats: [string, string | number][] = [
      ["Ping", `${client.ws.ping}ms`],
    ];

    if (client.shard) {
      if (interaction.guildId) {
        const id = calculateShardId(interaction.guildId, client.shard.count);

        stats.unshift(["Shard", `${id + 1}/${client.shard.count}`]);
      } else {
        stats.unshift(["Shards", `${client.shard.count}`]);
      }
    }

    if (VERSION)
      stats.push(["Version", VERSION]);

    await appStats.fetch({ filter: "users" });

    stats.unshift(
      ["Servers", appStats.guilds < appStats.totalGuilds ?
        `${appStats.guilds}/${appStats.totalGuilds}` :
        appStats.guilds],
      ["Channels", appStats.channels < appStats.totalChannels ?
        `${appStats.channels}/${appStats.totalChannels}` :
        appStats.channels],
      ["Users", appStats.users < appStats.totalUsers ?
        `${appStats.users}/${appStats.totalUsers}` :
        appStats.users],
      ["Emojis", appStats.emojis < appStats.totalEmojis ?
        `${appStats.emojis}/${appStats.totalEmojis}` :
        appStats.emojis],
      ["Messages", appStats.messages],
      ["Interactions", appStats.interactions],
    );

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: username!, iconURL })
          .setColor("Random")
          .setFields([
            { name: "Library", value: codeBlock("c", library), inline },
            { name: "Engine", value: codeBlock("c", engine), inline },
            { name: "Stats", value: codeBlock("c", makeTable(stats)) },
            { name: "Machine", value: codeBlock("c", machine) },
            { name: "Uptime", value: `${time(client.readyAt!)} ${time(client.readyAt!, "R")}` },
          ]),
      ],
    });

    return;
  }
}
