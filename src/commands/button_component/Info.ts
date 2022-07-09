import { stripIndents } from 'common-tags';
import { ButtonInteraction, codeBlock, EmbedBuilder, time, version as djsVersion } from 'discord.js';
import { cpus, totalmem, version } from 'node:os';
import { env, memoryUsage, versions } from 'node:process';
import { InfoCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

const CPUs = cpus();
const OS = version();
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const inline = true;

export default class Info extends ButtonComponentInteraction {
  [k: string]: any;

  constructor() {
    super({
      name: 'info',
      description: 'Info',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId } = interaction;

    const { sc } = <InfoCustomId>JSON.parse(customId);

    const embeds = [new EmbedBuilder().setColor('Random')];

    this[sc]?.(interaction, embeds);
  }

  async application(interaction: ButtonInteraction, embeds: EmbedBuilder[]) {
    const { client, guild } = interaction;

    const { readyAt, user, ws } = client;

    const me = guild?.members.me;

    const avatarURL = me?.displayAvatarURL() ?? user?.displayAvatarURL();

    const username = me?.displayName ?? user?.username;

    const { heapUsed } = memoryUsage();

    const engine = stripIndents(`
      Node : ${versions.node}
      `);

    const library = stripIndents(`
      Discord.js : ${(npm_package_dependencies_discord_js ?? djsVersion).match(/(?:\D*)([\d\D]+)/)?.[1]}
      `);

    const machine = stripIndents(`
      Memory : ${new this.Util.Bytes(heapUsed)} / ${new this.Util.Bytes(totalmem())}
      CPU    : ${CPUs[0].model} (${CPUs.length} cores)
      OS     : ${OS}
      `);

    const stats = stripIndents(`
      Servers  : ${client.stats.guilds}
      Channels : ${client.stats.channels}
      Members  : ${client.stats.members}
      Ping     : ${ws.ping} ms
      Version  : ${npm_package_version}
      `);

    embeds[0].setAuthor({ name: username!, iconURL: avatarURL })
      .setFields([
        { name: 'Library', value: codeBlock('properties', library), inline },
        { name: 'Engine', value: codeBlock('properties', engine), inline },
        { name: 'Stats', value: codeBlock('properties', stats) },
        { name: 'Machine', value: codeBlock('properties', machine) },
        { name: 'Uptime', value: `${time(readyAt!)} ${time(readyAt!, 'R')}` },
      ]);

    return interaction.update({ embeds });
  }
}