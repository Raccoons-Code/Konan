import { codeBlock, time } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import { ButtonInteraction, Client, MessageEmbed, version as djs_version } from 'discord.js';
import { InfoCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

const { versions, env } = process;
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const { node } = versions;
const inline = true;

export default class Info extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'info',
      description: 'Info',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId } = interaction;

    const { sc } = <InfoCustomId>JSON.parse(customId);

    const embeds = [new MessageEmbed().setColor('RANDOM')];

    this[<'application'>sc]?.(interaction, embeds);
  }

  async application(interaction: ButtonInteraction, embeds: MessageEmbed[]) {
    const { client, guild } = interaction;

    const { channels, guilds, readyAt, user, users, ws } = client;

    const avatarURL = guild?.me?.displayAvatarURL({ dynamic: true }) ?? user?.displayAvatarURL({ dynamic: true });

    const username = <string>guild?.me?.displayName ?? user?.username;

    const newStats = await client.fetchStats();

    const { heapTotal, heapUsed } = process.memoryUsage();

    const stats = stripIndents(`
      Servers  : ${newStats.guilds ?? guilds.cache.size}
      Channels : ${newStats.channels ?? channels.cache.size}
      Members  : ${newStats.members ?? users.cache.size}
      Ping     : ${ws.ping} ms
      Memory   : ${this.Util.bytes(heapUsed).join(' ')} / ${this.Util.bytes(heapTotal).join(' ')}
      Version  : ${npm_package_version}
      `);

    const library = stripIndents(`
      Discord.js : ${(npm_package_dependencies_discord_js ?? djs_version).match(/(?:\D*)([\d\D]+)/)?.[1]}
      `);

    const engine = stripIndents(`
      Node : ${node}
      `);

    embeds[0].setAuthor({ name: username, iconURL: avatarURL })
      .setFields([
        { name: 'Library', value: codeBlock('properties', library), inline },
        { name: 'Engine', value: codeBlock('properties', engine), inline },
        { name: 'Stats', value: codeBlock('properties', stats) },
        { name: 'Uptime', value: `${time(readyAt!)} ${time(readyAt!, 'R')}` },
      ]);

    await interaction.update({ embeds });
  }
}