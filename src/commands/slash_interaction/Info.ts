import { codeBlock, inlineCode, SlashCommandBuilder, time, userMention } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import { CategoryChannel, Channel, Client, CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role, StageChannel, TextChannel, ThreadChannel, version as djsVersion, VoiceChannel } from 'discord.js';
import ms from 'ms';
import { cpus, totalmem, version } from 'node:os';
import { env, memoryUsage, versions } from 'node:process';
import { SlashCommand } from '../../structures';

const CPUs = cpus();
const OS = version();
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const inline = true;

export default class Info extends SlashCommand {
  [k: string]: any

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('info')
      .setDescription('Show the info message.')
      .setNameLocalizations(this.getLocalizations('infoName'))
      .setDescriptionLocalizations(this.getLocalizations('infoDescription'))
      .addSubcommand(subCommand => subCommand.setName('application')
        .setDescription('Show the bot info.')
        .setNameLocalizations(this.getLocalizations('infoApplicationName'))
        .setDescriptionLocalizations(this.getLocalizations('infoApplicationDescription')))
      .addSubcommand(subcommand => subcommand.setName('channel')
        .setDescription('Show the channel info.')
        .setNameLocalizations(this.getLocalizations('infoChannelName'))
        .setDescriptionLocalizations(this.getLocalizations('infoChannelDescription'))
        .addChannelOption(option => option.setName('channel')
          .setDescription('Select a channel to show the info for.')
          .setNameLocalizations(this.getLocalizations('infoChannelChannelName'))
          .setDescriptionLocalizations(this.getLocalizations('infoChannelChannelDescription'))))
      .addSubcommand(subcommand => subcommand.setName('role')
        .setDescription('Role info.')
        .setNameLocalizations(this.getLocalizations('infoRoleName'))
        .setDescriptionLocalizations(this.getLocalizations('infoRoleDescription'))
        .addRoleOption(option => option.setName('role')
          .setDescription('Select a role to show the info for.')
          .setNameLocalizations(this.getLocalizations('infoRoleRoleName'))
          .setDescriptionLocalizations(this.getLocalizations('infoRoleRoleDescription'))
          .setRequired(true)))
      .addSubcommand(subCommand => subCommand.setName('server')
        .setDescription('Show the server info.')
        .setNameLocalizations(this.getLocalizations('infoServerName'))
        .setDescriptionLocalizations(this.getLocalizations('infoServerDescription')))
      .addSubcommand(subCommand => subCommand.setName('user')
        .setDescription('Show the user info.')
        .setNameLocalizations(this.getLocalizations('infoUserName'))
        .setDescriptionLocalizations(this.getLocalizations('infoUserDescription'))
        .addUserOption(option => option.setName('user')
          .setDescription('Select a user to show the info for.')
          .setNameLocalizations(this.getLocalizations('infoUserUserName'))
          .setDescriptionLocalizations(this.getLocalizations('infoUserUserDescription'))));
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const subcommand = options.getSubcommand();

    const embeds = [new MessageEmbed().setColor('RANDOM')];

    const components = [new MessageActionRow()];

    await this[subcommand]?.(interaction, embeds, components);
  }

  async application(interaction: CommandInteraction, embeds: MessageEmbed[], components: MessageActionRow[]) {
    const { client, guild } = interaction;

    const { channels, guilds, readyAt, user, users, ws } = client;

    const avatarURL = guild?.me?.displayAvatarURL({ dynamic: true }) ?? user?.displayAvatarURL({ dynamic: true });

    const username = guild?.me?.displayName ?? user?.username;

    const { heapUsed } = memoryUsage();

    const engine = stripIndents(`
      Node : ${versions.node}
      `);

    const library = stripIndents(`
      Discord.js : ${(npm_package_dependencies_discord_js ?? djsVersion).match(/(?:\D*)([\d\D]+)/)?.[1]}
      `);

    const machine = stripIndents(`
      CPU    : ${CPUs[0].model} (${CPUs.length} cores)
      Memory : ${this.Util.bytes(heapUsed).join(' ')} / ${this.Util.bytes(totalmem()).join(' ')}
      OS     : ${OS}
      `);

    const stats = stripIndents(`
      Servers  : ${client.stats.guilds ?? guilds.cache.size}
      Channels : ${client.stats.channels ?? channels.cache.size}
      Members  : ${client.stats.members ?? users.cache.size}
      Ping     : ${ws.ping} ms
      Version  : ${npm_package_version}
      `);

    embeds[0]
      .setAuthor({ name: username!, iconURL: avatarURL })
      .setFields([
        { name: 'Library', value: codeBlock('properties', library), inline },
        { name: 'Engine', value: codeBlock('properties', engine), inline },
        { name: 'Stats', value: codeBlock('properties', stats) },
        { name: 'Machine', value: codeBlock('properties', machine) },
        { name: 'Uptime', value: `${time(readyAt!)} ${time(readyAt!, 'R')}` },
      ]);

    const buttons = [
      new MessageButton()
        .setCustomId(JSON.stringify({ c: this.data.name, sc: 'application' }))
        .setEmoji('🔄')
        .setLabel('Update')
        .setStyle('SECONDARY'),
    ];

    components[0].setComponents(buttons);

    await interaction.editReply({ components, embeds });
  }

  async channel(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const { locale, options } = interaction;

    const channel = options.getChannel('channel') ?? interaction.channel;

    /** DM */
    /* const { } = <DMChannel | PartialDMChannel>channel; */
    /** GUILD_NEWS */
    /* const { } = <NewsChannel>channel; */
    /** GUILD_STORE */
    /* const { } = <StoreChannel>channel; */
    /** GUILD_CATEGORY */
    const { children, parent } = <CategoryChannel>channel;
    /** GUILD_TEXT */
    const { nsfw, rateLimitPerUser, topic, threads } = <TextChannel>channel;
    /** GUILD_NEWS_THREAD | GUILD_PRIVATE_THREAD | GUILD_PUBLIC_THREAD */
    const { memberCount, messageCount } = <ThreadChannel>channel;
    /** GUILD_STAGE_VOICE | GUILD_VOICE */
    const { bitrate, full, name, rtcRegion, userLimit } = <StageChannel | VoiceChannel>channel;
    const { createdAt, type } = <Channel>channel;

    const t = `${type}`.split('_').pop();

    embeds[0].addField(this.t('type', { locale }), this.t(`${t}`, { locale }), true);

    if (parent)
      embeds[0].addField(this.t('category', { locale }), `${parent}`, true);

    if (['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(type))
      embeds[0].addFields([
        { name: this.t('bitrate', { locale }), value: `${bitrate / 1000}kb's`, inline },
        { name: this.t('rtcRegion', { locale }), value: rtcRegion ?? this.t('automatic', { locale }), inline },
        { name: this.t('userLimit', { locale }), value: `${userLimit || ':infinity:'}`, inline },
        { name: this.t('full', { locale }), value: this.t(`${full}`, { locale }), inline },
      ]);

    if (['GUILD_NEWS', 'GUILD_STORE', 'GUILD_TEXT'].includes(type)) {
      const arrayThreads = threads.cache.map(thread => thread);
      const textThreads = arrayThreads.join(' ').trim() || '-';

      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: 'NSFW', value: this.t(`${nsfw}`, { locale }), inline },
        { name: `${this.t('threads', { locale })} [${arrayThreads.length}]`, value: textThreads },
      ]);
    }

    if (['GUILD_NEWS_THREAD', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(type))
      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: this.t('memberCount', { locale }), value: `${memberCount}`, inline },
        { name: this.t('messageCount', { locale }), value: `${messageCount}`, inline },
      ]);

    if (['GUILD_CATEGORY'].includes(type)) {
      const arrayChildren = children.map(child => child);
      const textChildren = arrayChildren.join(' ').trim() || '-';

      embeds[0].addField(`${this.t('channels', { locale })} [${arrayChildren.length}]`, textChildren);
    }

    embeds[0]
      .setTitle(name)
      .addField(this.t('creationDate', { locale }), `${time(createdAt!)} ${time(createdAt!, 'R')}`);

    if (topic)
      embeds[0].addField(this.t('topic', { locale }), topic, true);

    await interaction.editReply({ embeds });
  }

  async role(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const { locale, options } = interaction;

    const role = <Role>options.getRole('role', true);

    const { color, mentionable, permissions, name } = role;

    const arrayPerms = permissions.toArray();
    const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

    embeds[0]
      .setColor(color || 'RANDOM')
      .setAuthor({ name, iconURL: role.iconURL()! })
      .addFields([
        { name: this.t('mentionable', { locale }), value: this.t(`${mentionable}`, { locale }) },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
      ]);

    await interaction.editReply({ embeds });
  }

  async server(interaction: CommandInteraction, embeds: MessageEmbed[]): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild } = interaction;

    embeds[0]
      .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
      .setFields(
        { name: this.t('id', { locale }), value: inlineCode(guild.id), inline: true },
        { name: this.t('owner', { locale }), value: userMention(guild.ownerId), inline: true },
        { name: this.t('members', { locale }), value: `${guild.memberCount}`, inline: true },
      )
      .setFooter({ text: this.t('serverCreatedAt', { locale }) })
      .setImage(guild.splashURL({ size: 512 })!)
      .setThumbnail(guild.iconURL()!)
      .setTimestamp(guild.createdTimestamp);

    await interaction.editReply({ embeds });
  }

  async user(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const { locale, options } = interaction;

    const user = options.getUser('user') ?? interaction.user;
    const member = <GuildMember>options.getMember('user') ?? interaction.member;

    const { createdAt, id, tag } = user;

    embeds[0]
      .setDescription(`${user}`)
      .setFields(
        { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline: true },
        { name: this.t('discordId', { locale }), value: inlineCode(id), inline: true },
      )
      .setFooter({ text: this.t(member ? 'joinedTheServerAt' : 'creationDate', { locale }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(member?.joinedTimestamp ?? createdAt);

    if (member) {
      const { avatar, displayColor, permissions, roles } = member;

      const arrayRoles = roles.cache.map(role => role);
      const textRoles = arrayRoles.join(' ').trim().replace('@everyone', '') || '-';
      const arrayPerms = permissions.toArray();
      const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` },
      );

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(member.displayAvatarURL({ dynamic: true }));
    }

    await interaction.editReply({ embeds });
  }
}