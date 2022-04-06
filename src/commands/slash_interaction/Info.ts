import { codeBlock, inlineCode, SlashCommandBuilder, time, userMention } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import { CategoryChannel, Channel, CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role, StageChannel, TextChannel, ThreadChannel, version as discordjs_version, VoiceChannel } from 'discord.js';
import ms from 'ms';
import { Client, SlashCommand } from '../../structures';

const { versions, env } = process;
const { npm_package_dependencies_discord_js, npm_package_version } = env;
const { node } = versions;
const inline = true;

export default class extends SlashCommand {
  [k: string]: any

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('info')
      .setDescription('Server or user info.')
      .addSubcommand(subCommand => subCommand.setName('application')
        .setDescription('Bot info.'))
      .addSubcommand(subcommand => subcommand.setName('channel')
        .setDescription('Channel info.')
        .addChannelOption(option => option.setName('channel')
          .setDescription('Select channel.')))
      .addSubcommand(subcommand => subcommand.setName('role')
        .setDescription('Role info.')
        .addRoleOption(option => option.setName('role')
          .setDescription('Select role.')
          .setRequired(true)))
      .addSubcommand(subCommand => subCommand.setName('server')
        .setDescription('Server info.'))
      .addSubcommand(subCommand => subCommand.setName('user')
        .setDescription('User info.')
        .addUserOption(option => option.setName('user')
          .setDescription('Select user.')));
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

    const username = <string>guild?.me?.displayName ?? user?.username;

    const { heapTotal, heapUsed } = process.memoryUsage();

    const stats = stripIndents(`
      Servers  : ${this.client.stats.guilds ?? guilds.cache.size}
      Channels : ${this.client.stats.channels ?? channels.cache.size}
      Members  : ${this.client.stats.members ?? users.cache.size}
      Ping     : ${ws.ping} ms
      Memory   : ${this.util.bytes(heapUsed).join(' ')} / ${this.util.bytes(heapTotal).join(' ')}
      Version  : ${npm_package_version}
      `);

    const library = stripIndents(`
      Discord.js : ${(npm_package_dependencies_discord_js ?? discordjs_version).match(/(?:\D*)([\d\D]+)/)?.[1]}
      `);

    const engine = stripIndents(`
      Node : ${node}
      `);

    embeds[0].setAuthor({ name: username, iconURL: avatarURL })
      .setFields([
        { name: 'Library', value: codeBlock('properties', library), inline },
        { name: 'Engine', value: codeBlock('properties', engine), inline },
        { name: 'Stats', value: codeBlock('properties', stats) },
        { name: 'Uptime', value: `${time(<Date>readyAt)} ${time(<Date>readyAt, 'R')}` },
      ]);

    const buttons = [new MessageButton()
      .setCustomId(JSON.stringify({ c: this.data.name, sc: 'application' }))
      .setEmoji('🔄')
      .setLabel('Update')
      .setStyle('SECONDARY')];

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

    embeds[0].setFields([{ name: this.t('type', { locale }), value: this.t(`${t}`, { locale }), inline }]);

    if (parent)
      embeds[0].addField(this.t('category', { locale }), `${parent}`, true);

    if (['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(type))
      embeds[0].addFields([
        { name: this.t('bitrate', { locale }), value: `${bitrate / 1000}kbps`, inline },
        { name: this.t('rtcRegion', { locale }), value: rtcRegion ?? this.t('automatic', { locale }), inline },
        { name: this.t('userLimit', { locale }), value: `${userLimit || ':infinity:'}`, inline },
        { name: this.t('full', { locale }), value: this.t(`${full}`, { locale }), inline }]);

    if (['GUILD_NEWS', 'GUILD_STORE', 'GUILD_TEXT'].includes(type)) {
      const arrayThreads = threads.cache.map(thread => thread);
      const textThreads = arrayThreads.join(' ').trim() || '-';

      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: 'NSFW', value: this.t(`${nsfw}`, { locale }), inline },
        { name: `${this.t('threads', { locale })} [${arrayThreads.length}]`, value: textThreads }]);
    }

    if (['GUILD_NEWS_THREAD', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(type))
      embeds[0].addFields([
        { name: this.t('slowmode', { locale }), value: ms(rateLimitPerUser * 1000), inline },
        { name: this.t('memberCount', { locale }), value: `${memberCount}`, inline },
        { name: this.t('messageCount', { locale }), value: `${messageCount}`, inline }]);

    if (['GUILD_CATEGORY'].includes(type)) {
      const arrayChildren = children.map(child => child);
      const textChildren = arrayChildren.join(' ').trim() || '-';

      embeds[0].addFields([
        { name: `${this.t('channels', { locale })} [${arrayChildren.length}]`, value: textChildren }]);
    }

    embeds[0].setTitle(name)
      .addFields([
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` },
      ]);

    if (topic)
      embeds[0].addField(this.t('topic', { locale }), topic, true);

    await interaction.editReply({ embeds });
  }

  async role(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const { locale, options } = interaction;

    const role = <Role>options.getRole('role');

    const { color, mentionable, permissions, name } = role;

    const arrayPerms = permissions.toArray();
    const textPerms = arrayPerms.map(p => this.t('PERMISSION', { locale, PERMISSIONS: [p] })).join(', ') || '-';

    embeds[0].setColor(color || 'RANDOM')
      .setAuthor({ name, iconURL: <string>role.iconURL() })
      .addFields([
        { name: this.t('mentionable', { locale }), value: this.t(`${mentionable}`, { locale }) },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) }]);

    await interaction.editReply({ embeds });
  }

  async server(interaction: CommandInteraction, embeds: MessageEmbed[]): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild } = interaction;

    embeds[0].setAuthor({ name: guild.name, iconURL: <string>guild.iconURL() })
      .setFields(
        { name: this.t('id', { locale }), value: inlineCode(guild.id), inline: true },
        { name: this.t('owner', { locale }), value: userMention(guild.ownerId), inline: true },
        { name: this.t('members', { locale }), value: `${guild.memberCount}`, inline: true },
      )
      .setFooter({ text: this.t('serverCreatedAt', { locale }) })
      .setImage(<string>guild.splashURL({ size: 512 }))
      .setThumbnail(<string>guild.iconURL())
      .setTimestamp(guild.createdTimestamp);

    await interaction.editReply({ embeds });
  }

  async user(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const { locale, options } = interaction;

    const user = options.getUser('user') ?? interaction.user;
    const member = <GuildMember>options.getMember('user') ?? interaction.member;

    const { createdAt, id, tag } = user;

    embeds[0].setDescription(`${user}`)
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
      const textPerms = arrayPerms.map(p => this.t('PERMISSION', { locale, PERMISSIONS: [p] })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(member.displayAvatarURL({ dynamic: true }));
    }

    await interaction.editReply({ embeds });
  }
}