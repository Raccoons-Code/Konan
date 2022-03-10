const { ButtonInteraction } = require('../../structures');
const { codeBlock, time } = require('@discordjs/builders');
const { MessageEmbed, version: discordjs_version } = require('discord.js');
const { stripIndents } = require('common-tags');
const { versions, env } = process;
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const { node } = versions;
const inline = true;

module.exports = class extends ButtonInteraction {
  constructor(client) {
    super(client);
    this.data = {
      name: 'info',
      description: 'Info',
    };
  }

  async execute(interaction = this.ButtonInteraction) {
    const { customId } = interaction;

    const { sc } = this.util.parseJSON(customId);

    const embeds = this.embeds = [new MessageEmbed().setColor('RANDOM')];

    this[sc]?.(interaction, embeds);
  }

  async application(interaction = this.ButtonInteraction, embeds = this.embeds) {
    const { client, guild } = interaction;

    const { channels, guilds, readyAt, user, users, ws } = client;

    const avatarURL = guild?.me.displayAvatarURL({ dynamic: true }) || user.displayAvatarURL({ dynamic: true });

    const username = guild?.me.displayName || user.username;

    const newStats = await client.fetchStats();

    const stats = stripIndents(`
      Servers  : ${newStats.totalGuilds || guilds.cache.size}
      Channels : ${newStats.totalChannels || channels.cache.size}
      Members  : ${newStats.totalMembers || users.cache.size}
      Ping     : ${ws.ping} ms
      Version  : ${npm_package_version}
      `);

    const library = stripIndents(`
      Discord.js : ${(npm_package_dependencies_discord_js || discordjs_version).match(/(?:\D*)([\d\D]+)/)[1]}
      `);

    const engine = stripIndents(`
      Node : ${node}
      `);

    embeds[0].setAuthor({ name: username, iconURL: avatarURL })
      .setFields([
        { name: 'Library', value: codeBlock('properties', library), inline },
        { name: 'Engine', value: codeBlock('properties', engine), inline },
        { name: 'Stats', value: codeBlock('properties', stats) },
        { name: 'Uptime', value: `${time(readyAt)} ${time(readyAt, 'R')}` },
      ]);

    await interaction.update({ embeds });
  }
};