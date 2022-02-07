const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('info')
      .setDescription('Server or user info')
      .addSubcommand(subCommand => subCommand.setName('application')
        .setDescription('Bot info'))
      .addSubcommand(subCommand => subCommand.setName('server')
        .setDescription('Server info'))
      .addSubcommand(subCommand => subCommand.setName('user')
        .setDescription('User info')
        .addUserOption(option => option.setName('user')
          .setDescription('Select user.')));
  }

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const subcommand = options.getSubcommand();

    const embeds = this.embeds = [new MessageEmbed().setColor('RANDOM')];

    this[subcommand]?.(interaction, embeds);
  }

  async application(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { client } = interaction;

    const { channels, guilds, uptime, users, ws } = client;

    const uptimeDate = new Date(Date.now() - uptime)

    const stats = stripIndents(`
      Servers  : ${guilds.cache.size}
      Channels : ${channels.cache.size}
      Users    : ${users.cache.size}
      Ping     : ${ws.ping}
      Uptime   : ${uptimeDate.toDateString()} ${uptimeDate.getHours()}:${uptimeDate.getMinutes()}
      `);

    embeds[0].setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setFields([{ name: 'Stats', value: `\`\`\`asciidoc\n${stats}\`\`\`` }]);

    interaction.editReply({ embeds });
  }

  async server(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { guild, locale } = interaction;

    if (!guild)
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    embeds[0].setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
      .setThumbnail(guild.iconURL())
      .setFields(
        { name: this.t('ID', { locale }), value: `${guild.id}`, inline: true },
        { name: this.t('owner', { locale, capitalize: true }), value: `<@${guild.ownerId}>`, inline: true },
        { name: this.t('members', { locale, capitalize: true }), value: `${guild.memberCount}`, inline: true },
      )
      .setImage(guild.splashURL({ dynamic: true, format: 'png', size: 512 }))
      .setTimestamp(guild.createdTimestamp)
      .setFooter({ text: this.t('Server created at', { locale }) });

    interaction.editReply({ embeds });
  }

  async user(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { locale, options } = interaction;

    const user = options.getUser('user') || interaction.user;
    const member = options.getMember('user') || interaction.member;

    embeds[0].setDescription(`${user}`)
      .setThumbnail(user.displayAvatarURL())
      .setFields(
        { name: this.t('Discord Tag', { locale }), value: `\`${user.tag}\``, inline: true },
        { name: this.t('Discord ID', { locale }), value: `\`${user.id}\``, inline: true },
      )
      .setTimestamp(member?.joinedTimestamp || user.createdAt)
      .setFooter({ text: this.t(member ? 'Joined the server at' : 'Creation date', { locale }) });

    if (member) {
      const { permissions, roles } = member;

      const textRoles = roles.cache.reduce((acc, role) => `${acc}${role.name}\n`, '');
      const permsArray = permissions.toArray();
      const textPerms = permsArray.reduce((acc, permission, i, a) => `${acc}${this.t('PERMISSION', { locale, PERMISSIONS: [permission] })}${i + 1 === a.length ? '.' : ', '}`, '');

      embeds[0].addFields(
        { name: this.t('role', { locale, capitalize: true }), value: `${member.roles.highest}`, inline: true },
        { name: this.t('roles', { locale, capitalize: true }), value: `\`\`\`${textRoles}\`\`\`` },
        { name: this.t('permissions', { locale, capitalize: true }), value: `\`\`\`${textPerms}\`\`\`` },
        { name: this.t('Creation date', { locale }), value: `\`\`\`${user.createdAt}\`\`\`` });

      if (member.avatar)
        embeds[0].setThumbnail(member.displayAvatarURL());

      if (member.roles.color)
        embeds[0].setColor(member.displayColor);
    }

    interaction.editReply({ embeds });
  }
};