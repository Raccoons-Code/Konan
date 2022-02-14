const { SlashCommand } = require('../../classes');
const { codeBlock, inlineCode, time, userMention } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { version } = require(require.main.path + '/../../package.json');
const { DateTimeFormat } = Intl;
const ms = require('ms');
const dateOptions = { dateStyle: 'medium', timeStyle: 'long' };
const inline = true;

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('info')
      .setDescription('Server or user info')
      .addSubcommand(subCommand => subCommand.setName('application')
        .setDescription('Bot info'))
      .addSubcommand(subcommand => subcommand.setName('channel')
        .setDescription('Channel info')
        .addChannelOption(option => option.setName('channel')
          .setDescription('Channel')))
      .addSubcommand(subcommand => subcommand.setName('role')
        .setDescription('Role info')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role')
          .setRequired(true)))
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
    const { client, locale } = interaction;

    const { channels, guilds, readyAt, users, ws } = client;

    const stats = stripIndents(`
      Servers  : ${client.totalGuilds || guilds.cache.size}
      Channels : ${client.totalChannels || channels.cache.size}
      Members  : ${client.totalMembers || users.cache.size}
      Ping     : ${ws.ping} ms
      Uptime   : ${new DateTimeFormat(locale, dateOptions).format(readyAt)}
      Version  : ${version}
      `);

    embeds[0].setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setFields([{ name: 'Stats', value: codeBlock('properties', stats) }]);

    interaction.editReply({ embeds });
  }

  async channel(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel') || interaction.channel;

    const { bitrate, children, createdAt, full, memberCount, messageCount, name, parent, rateLimitPerUser, rtcRegion, topic, userLimit, type } = channel;

    const typ = type.split('_');

    const t = typ[typ.length - 1];

    if (interaction.inGuild()) {
      embeds[0].setFields([{ name: this.t('type', { locale }), value: this.t(t, { locale }), inline }]);

      if (parent)
        embeds[0].addField(this.t('category', { locale }), `${parent}`, true);

      if (['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(type))
        embeds[0].addFields([
          { name: this.t('bitrate', { locale }), value: `${bitrate / 1000}kbps`, inline },
          { name: this.t('rtcRegion', { locale }), value: rtcRegion || this.t('automatic', { locale }), inline },
          { name: this.t('userLimit', { locale }), value: `${userLimit || ':infinity:'}`, inline },
          { name: this.t('full', { locale }), value: this.t(full, { locale }), inline }]);

      if (['GUILD_NEWS', 'GUILD_STORE', 'GUILD_TEXT'].includes(type))
        embeds[0].addFields([
          { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
          { name: 'NSFW', value: this.t(channel.nsfw, { locale }), inline }]);

      if (['GUILD_NEWS_THREAD', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(type))
        embeds[0].addFields([
          { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
          { name: this.t('memberCount', { locale }), value: `${memberCount}`, inline },
          { name: this.t('messageCount', { locale }), value: `${messageCount}`, inline }]);

      if (type === 'GUILD_CATEGORY')
        embeds[0].addFields([
          { name: this.t('channels', { locale }), value: children.map(child => child).join(' ') || '-' }]);
    }

    embeds[0].setTitle(name)
      .addFields([
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` },
      ]);

    if (topic)
      embeds[0].addField(this.t('topic', { locale }), topic, true);

    interaction.editReply({ embeds });
  }

  async role(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { locale, options } = interaction;

    const role = options.getRole('role');

    const { color, mentionable, permissions, icon, name, tags } = role;

    const perms = permissions.toArray();
    const arrayPerms = perms.map((permission) => this.t('PERMISSION', { locale, PERMISSIONS: [permission] }));
    const textPerms = `${arrayPerms.join(', ')}.`;

    embeds[0].setColor(color || 'RANDOM')
      .setAuthor({ name, iconURL: role.iconURL() })
      .addFields([{ name: this.t('mentionable', { locale }), value: this.t(mentionable, { locale }) },
      { name: this.t('permissions', { locale }), value: codeBlock('md', textPerms) }]);

    interaction.editReply({ embeds });
  }

  async server(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { guild, locale } = interaction;

    if (!guild)
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    embeds[0].setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setFields(
        { name: this.t('id', { locale }), value: inlineCode(guild.id), inline: true },
        { name: this.t('owner', { locale }), value: userMention(guild.ownerId), inline: true },
        { name: this.t('members', { locale }), value: `${guild.memberCount}`, inline: true },
      )
      .setFooter({ text: this.t('serverCreatedAt', { locale }) })
      .setImage(guild.splashURL({ dynamic: true, size: 512 }))
      .setThumbnail(guild.iconURL())
      .setTimestamp(guild.createdTimestamp);

    interaction.editReply({ embeds });
  }

  async user(interaction = this.CommandInteraction, embeds = this.embeds) {
    const { locale, options } = interaction;

    const user = options.getUser('user') || interaction.user;
    const member = options.getMember('user') || interaction.member;

    const { createdAt, id, tag } = user;

    embeds[0].setDescription(`${user}`)
      .setFields(
        { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline: true },
        { name: this.t('discordId', { locale }), value: inlineCode(id), inline: true },
      )
      .setFooter({ text: this.t(member ? 'joinedTheServerAt' : 'creationDate', { locale }) })
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp(member?.joinedTimestamp || createdAt);

    if (member) {
      const { avatar, displayColor, permissions, roles } = member;

      const textRoles = roles.cache.map(role => role).join(' ').replace('@everyone', '') || '-';
      const perms = permissions.toArray();
      const arrayPerms = perms.map((permission) => this.t('PERMISSION', { locale, PERMISSIONS: [permission] }));
      const textPerms = arrayPerms.join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: this.t('roles', { locale }), value: textRoles },
        { name: this.t('permissions', { locale }), value: codeBlock('md', textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(member.displayAvatarURL());
    }

    interaction.editReply({ embeds });
  }
};