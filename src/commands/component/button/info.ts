import { stripIndents } from "common-tags";
import { ButtonInteraction, codeBlock, EmbedBuilder, time } from "discord.js";
import { memoryUsage, versions } from "node:process";
import { BaseProcessMessage, InfoCustomId, Stats } from "../../../@types";
import client, { appStats } from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";
import Bytes from "../../../util/Bytes";
import { CPU_CORES, CPU_MODEL, DJS_VERSION, OS_VERSION, TOTAL_RAM, VERSION } from "../../../util/constants";
import { makeTable } from "../../../util/utils";
import { fetchProcessResponse } from "../../../util/Process";

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

    const engine = stripIndents(`
      Node : ${versions.node}
    `);

    const library = stripIndents(`
      Discord.js : ${DJS_VERSION}
    `);

    const machine = stripIndents(`
      CPU : ${CPU_MODEL} (${CPU_CORES} cores)
      OS  : ${OS_VERSION}
      RAM : ${new Bytes(memoryUsage().heapUsed)} / ${new Bytes(TOTAL_RAM)}
    `);

    const stats: [string, string | number][] = [
      ["Ping", `${client.ws.ping}ms`],
    ];

    if (client.shard) {
      stats.unshift(["Shard", `${appStats.shardId + 1}/${client.shard.count}`]);
    }

    if (VERSION)
      stats.push(["Version", VERSION]);

      const status = await fetchProcessResponse({
        action: "stats",
      }) as (BaseProcessMessage & { data: Stats })[];

      const data = status.reduce((acc, cur) => {
        acc.channels += cur.data.channels;
        acc.emojis += cur.data.emojis;
        acc.guilds += cur.data.guilds;
        acc.interactions += cur.data.interactions;
        acc.messages += cur.data.messages;
        acc.users += cur.data.users;

        return acc;
      }, <Stats>{
        channels: 0,
        emojis: 0,
        guilds: 0,
        interactions: 0,
        messages: 0,
        users: 0,
      });

      stats.unshift(
        ["Servers", appStats.guilds < data.guilds ?
          `${appStats.guilds}/${data.guilds}` :
          appStats.guilds],
        ["Channels", appStats.channels < data.channels ?
          `${appStats.channels}/${data.channels}` :
          appStats.channels],
        ["Users", appStats.users < data.users ?
          `${appStats.users}/${data.users}` :
          appStats.users],
        ["Emojis", appStats.emojis < data.emojis ?
          `${appStats.emojis}/${data.emojis}` :
          appStats.emojis],
        ["Messages", appStats.messages < data.messages ?
          `${appStats.messages}/${data.messages}` :
          appStats.messages],
        ["Interactions", appStats.interactions < data.interactions ?
          `${appStats.interactions}/${data.interactions}` :
          appStats.interactions],
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
