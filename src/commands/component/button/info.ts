import { stripIndents } from "common-tags";
import { ButtonInteraction, codeBlock, EmbedBuilder, time } from "discord.js";
import { memoryUsage, versions } from "node:process";
import { InfoCustomId, Stats } from "../../../@types";
import client, { appStats } from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";
import Bytes from "../../../util/Bytes";
import { CPU_CORES, CPU_MODEL, DJS_VERSION, OS_VERSION, TOTAL_RAM, VERSION } from "../../../util/constants";
import { fetchProcessResponse } from "../../../util/Process";
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

    const engine = stripIndents(`
      Node : ${versions.node}
    `);

    const library = stripIndents(`
      Discord.js : ${DJS_VERSION}
    `);

    const stats: [string, string | number][] = [
      ["Ping", `${client.ws.ping}ms`],
    ];

    const status = await fetchProcessResponse<Stats>({
      action: "stats",
    });

    if (client.shard) {
      stats.unshift(["Shard", `${appStats.shardId + 1}/${appStats.totalShards}`]);
    }

    if (appStats.workers) {
      stats.unshift(["Cluster", `${appStats.workerId}/${appStats.workers}`]);
    }

    if (VERSION)
      stats.push(["Version", VERSION]);

    const data = status.reduce((acc, cur) => {
      acc.channels += cur.data.channels;
      acc.emojis += cur.data.emojis;
      acc.guilds += cur.data.guilds;
      acc.interactions += cur.data.interactions;
      acc.messages += cur.data.messages;
      acc.users += cur.data.users;
      acc.memoryUsage.heapUsed += cur.data.memoryUsage.heapUsed;

      Object.keys(cur.data.usedCommands).reduce((acc2, key) => {
        if (acc2[key]) {
          acc2[key] += cur.data.usedCommands[key];
        } else {
          acc2[key] = cur.data.usedCommands[key];
        }

        return acc2;
      }, acc.usedCommands);

      return acc;
    }, <Stats>{
      channels: 0,
      emojis: 0,
      guilds: 0,
      interactions: 0,
      messages: 0,
      users: 0,
      memoryUsage: {
        heapUsed: 0,
      },
      usedCommands: {},
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

    const popularCommands: [string, string | number][] =
      Object.keys(data.usedCommands)
        .sort((a, b) => data.usedCommands[a] > data.usedCommands[b] ? -1 : 1)
        .reduce<[string, string | number][]>((acc, key) => {
          acc.push([key, appStats.usedCommands[key] < data.usedCommands[key] ?
            `${appStats.usedCommands[key]}/${data.usedCommands[key]}` :
            appStats.usedCommands[key]]);

          return acc;
        }, []).slice(0, 10);

    const machine = stripIndents(`
      CPU : ${CPU_MODEL} (${CPU_CORES} cores)
      OS  : ${OS_VERSION}
      RAM : ${new Bytes(memoryUsage().heapUsed)} / ${new Bytes(data.memoryUsage.heapUsed)} / ${new Bytes(TOTAL_RAM)}
    `);

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: username!, iconURL })
          .setColor("Random")
          .setFields([
            { name: "Library", value: codeBlock("c", library), inline },
            { name: "Engine", value: codeBlock("c", engine), inline },
            { name: "Machine", value: codeBlock("c", machine) },
            { name: "Stats", value: codeBlock("c", makeTable(stats)), inline },
            { name: "Popular Commands", value: codeBlock("c", makeTable(popularCommands)), inline },
            { name: "Uptime", value: `${time(client.readyAt!)} ${time(client.readyAt!, "R")}` },
          ]),
      ],
    });

    return;
  }
}
