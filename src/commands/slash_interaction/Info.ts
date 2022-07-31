import { stripIndents } from 'common-tags';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, Channel, ChannelType, ChatInputCommandInteraction, codeBlock, EmbedBuilder, GuildMember, inlineCode, Role, SlashCommandBuilder, StageChannel, TextChannel, ThreadChannel, time, userMention, version as djsVersion, VoiceChannel } from 'discord.js';
import ms from 'ms';
import { cpus, totalmem, version } from 'node:os';
import { env, memoryUsage, versions } from 'node:process';
import { SlashCommand } from '../../structures';

const CPUs = cpus();
const OS = version();
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const { GuildNews, GuildNewsThread, GuildPrivateThread, GuildPublicThread, GuildStageVoice, GuildText, GuildVoice } = ChannelType;
const inline = true;

export default class Info extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('info')
      .setDescription('Show the info message.')
      .setNameLocalizations(this.getLocalizations('infoName'))
      .setDescriptionLocalizations(this.getLocalizations('infoDescription'))
      .addSubcommand(subCommand => subCommand.setName('app')
        .setDescription('Show the bot info.')
        .setNameLocalizations(this.getLocalizations('infoAppName'))
        .setDescriptionLocalizations(this.getLocalizations('infoAppDescription')))
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

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    const embeds = [new EmbedBuilder().setColor('Random')];

    const components = [new ActionRowBuilder<ButtonBuilder>()];

    return this[subcommand]?.(interaction, embeds, components);
  }

  async app(
    interaction: ChatInputCommandInteraction,
    embeds: EmbedBuilder[],
    components: ActionRowBuilder<ButtonBuilder>[],
  ): Promise<any> {
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
        CPU : ${CPUs[0].model} (${CPUs.length} cores)
        OS  : ${OS}
        RAM : ${new this.Util.Bytes(heapUsed)} / ${new this.Util.Bytes(totalmem())}
      `);

    const stats = stripIndents(`
        Servers  : ${client.stats.guilds}
        Channels : ${client.stats.channels}
        Members  : ${client.stats.members}
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

    components[0].setComponents([
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: 'info', sc: 'app' }))
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Secondary),
    ]);

    return interaction.editReply({ components, embeds });
  }

  async channel(interaction: ChatInputCommandInteraction, embeds: EmbedBuilder[]): Promise<any> {
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

    const t = `${ChannelType[type]}`.match(/([A-Z]{1,}[a-z]*)+/)?.[1];

    embeds[0].addFields({ name: this.t('type', { locale }), value: this.t(`${t}`, { locale }), inline });

    if (parent)
      embeds[0].addFields({ name: this.t('category', { locale }), value: `${parent}`, inline });

    if ([GuildStageVoice, GuildVoice].includes(type))
      embeds[0].addFields([
        { name: this.t('bitrate', { locale }), value: `${bitrate / 1000}kb's`, inline },
        { name: this.t('rtcRegion', { locale }), value: rtcRegion ?? this.t('automatic', { locale }), inline },
        { name: this.t('userLimit', { locale }), value: `${userLimit || ':infinity:'}`, inline },
        { name: this.t('full', { locale }), value: this.t(`${full}`, { locale }), inline },
      ]);

    if ([GuildNews, GuildText].includes(type)) {
      const arrayThreads = threads.cache.toJSON();
      const textThreads = arrayThreads.join(' ').trim() || '-';

      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: 'NSFW', value: this.t(`${nsfw}`, { locale }), inline },
        { name: `${this.t('threads', { locale })} [${arrayThreads.length}]`, value: textThreads },
      ]);
    }

    if ([GuildNewsThread, GuildPrivateThread, GuildPublicThread].includes(type))
      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: this.t('memberCount', { locale }), value: `${memberCount}`, inline },
        { name: this.t('messageCount', { locale }), value: `${messageCount}`, inline },
      ]);

    if (children) {
      const arrayChildren = children.cache.toJSON();
      const textChildren = arrayChildren.join(' ').trim() || '-';

      embeds[0].addFields({
        name: `${this.t('channels', { locale })} [${arrayChildren.length}]`,
        value: textChildren,
      });
    }

    embeds[0]
      .setTitle(name)
      .addFields({
        name: this.t('creationDate', { locale }),
        value: `${time(createdAt!)} ${time(createdAt!, 'R')}`,
      });

    if (topic)
      embeds[0].addFields({ name: this.t('topic', { locale }), value: topic, inline });

    return interaction.editReply({ embeds });
  }

  async role(interaction: ChatInputCommandInteraction, embeds: EmbedBuilder[]): Promise<any> {
    const { locale, options } = interaction;

    const role = <Role>options.getRole('role', true);

    const { color, mentionable, permissions, members, name, tags } = role;

    const arrayPerms = permissions.toArray();
    const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

    embeds[0]
      .setColor(color || 'Random')
      .setAuthor({ name, iconURL: role.iconURL()! })
      .addFields([
        { name: this.t('mentionable', { locale }), value: this.t(`${mentionable}`, { locale }), inline },
        { name: this.t('members', { locale }), value: `${members.size}`, inline },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: 'Bot role', value: this.t(`${!!tags?.botId}`, { locale }), inline },
        { name: 'Integration role', value: this.t(`${!!tags?.integrationId}`, { locale }), inline },
        { name: 'Subscriber role', value: this.t(`${!!tags?.premiumSubscriberRole}`, { locale }), inline },
      ]);

    return interaction.editReply({ embeds });
  }

  async server(interaction: ChatInputCommandInteraction, embeds: EmbedBuilder[]): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    const { guild } = interaction;

    const MPSText = Object.entries(guild.members.allMembersPresenceStatus)
      .map(([status, count]) => `${this.Util.Emoji[status] ?? status} ${inlineCode(`${count}`)}`).join('\n');

    embeds[0]
      .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
      .setFields(
        { name: this.t('owner', { locale }), value: userMention(guild.ownerId), inline },
        { name: this.t('id', { locale }), value: inlineCode(guild.id), inline },
        { name: this.t('preferredLocale', { locale }), value: inlineCode(guild.preferredLocale), inline },
        { name: `${this.t('members', { locale })} [${guild.memberCount}]`, value: MPSText, inline },
        { name: this.t('channels', { locale }), value: `${guild.channels.cache.size}`, inline },
        { name: this.t('emojis', { locale }), value: `${guild.emojis.cache.size}`, inline },
        {
          name: this.t('serverCreatedAt', { locale }),
          value: `${time(guild.createdAt)}${time(guild.createdAt, 'R')}`,
          inline,
        },
      )
      .setImage(guild.bannerURL({ size: 512 }))
      .setThumbnail(guild.iconURL());

    return interaction.editReply({ embeds });
  }

  async user(interaction: ChatInputCommandInteraction, embeds: EmbedBuilder[]): Promise<any> {
    const { guild, locale, options } = interaction;

    const user = options.getUser('user') ?? interaction.user;
    const member = <GuildMember>options.getMember('user') ?? interaction.member;

    await user.fetch();

    const { createdAt, flags, id, tag } = user;

    const components = <ActionRowBuilder<ButtonBuilder>[]>[];

    const flagsArray = flags?.toArray();
    const textFlags = flagsArray?.map(flag => inlineCode(this.t(flag, { locale }))).join('\n') || '-';

    embeds[0]
      .setDescription(`${user}`)
      .setFields([
        { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline },
        { name: this.t('discordId', { locale }), value: inlineCode(id), inline },
        { name: `Flags [${flagsArray?.length ?? 0}]`, value: textFlags },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)}${time(createdAt, 'R')}`, inline },
      ])
      .setThumbnail(user.displayAvatarURL())
      .setImage(user.bannerURL({ size: 512 })!);

    if (member) {
      const { avatar, displayColor, joinedAt, permissions, roles } = member;

      const arrayRoles = roles.cache.toJSON();
      const textRoles = arrayRoles.join(' ').replace('@everyone', '').trim() || '-';
      const arrayPerms = permissions.toArray();
      const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('joinedTheServerAt', { locale }), value: `${time(joinedAt!)}${time(joinedAt!, 'R')}` },
      );

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar) {
        embeds[0].setThumbnail(member.displayAvatarURL());
      }
    }

    const integrations = await guild?.fetchIntegrations();

    const integration = integrations?.find(i => i.application?.id === user.id);

    if (integration) {
      const { application } = integration;

      if (application) {
        const { description, privacyPolicyURL, termsOfServiceURL } = application;

        if (description)
          embeds[0].setDescription(description);

        if (privacyPolicyURL || termsOfServiceURL)
          components.push(new ActionRowBuilder<ButtonBuilder>());

        if (privacyPolicyURL)
          components[0]
            .addComponents(new ButtonBuilder()
              .setLabel('Privacy policy')
              .setStyle(ButtonStyle.Link)
              .setURL(privacyPolicyURL));

        if (termsOfServiceURL)
          components[0]
            .addComponents(new ButtonBuilder()
              .setLabel('Terms of service')
              .setStyle(ButtonStyle.Link)
              .setURL(termsOfServiceURL));
      }
    }

    return interaction.editReply({ components, embeds });
  }
}