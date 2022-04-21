import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Ban extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('ban')
      .setDescription('Bans a user from the server.')
      .addSubcommand(subcommand => subcommand.setName('single')
        .setDescription('Bans a user from the server.')
        .addUserOption(option => option.setName('user')
          .setDescription('The user to be banned.')
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setChoices([
            ['Last 24 hours', 1],
            ['Last 7 days', 7],
          ]))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for banishment, if any.')))
      .addSubcommand(subcommand => subcommand.setName('chunk')
        .setDescription('Bans a chunk of users from the server.')
        .addStringOption(option => option.setName('users')
          .setDescription('The list of users to ban.')
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setChoices([
            ['Last 24 hours', 1],
            ['Last 7 days', 7],
          ]))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban, if any.')));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions?.missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (userPermissions.length)
      return await interaction.editReply(this.t('missingUserPermission', {
        locale,
        PERMISSIONS: userPermissions,
      }));

    const clientPermissions =
      guild.me?.permissions.missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }));

    const command = <'chunk'>options.getSubcommand();

    await this[command]?.(interaction);
  }

  async single(interaction: CommandInteraction<'cached'>): Promise<any> {
    const { guild, locale, member, options } = interaction;

    const user = options.getMember('user', true);

    if (!user.bannable)
      return await interaction.editReply(this.t('banHierarchyError', { locale }));

    const days = options.getInteger('delete_messages') ?? 0;

    const reason = `Author: ${member.displayName}. Reason: ${options.getString('reason') || '-'}`;

    try {
      await guild.bans.create(user, { days, reason });

      await interaction.editReply(this.t('userBanned', { locale }));
    } catch {
      await interaction.editReply(this.t('banError', { locale }));
    }
  }

  async chunk(interaction: CommandInteraction<'cached'>): Promise<any> {
    const { options } = interaction;

    const users = options.getString('users', true);

    const usersArray = users.match(/\d{17,}/g) ?? [];

    if (!usersArray.length)
      return await interaction.editReply('No IDs were found in the users string.');

    const days = options.getInteger('delete_messages') ?? 0;

    const reason = options.getString('reason') || '-';

    const embeds = [
      new MessageEmbed()
        .setDescription(usersArray.map(user => `<@${user}>`).join(' ').slice(0, 4096))
        .setTitle('Chunk of users to ban')
        .setFields([{
          name: 'Reason for ban',
          value: reason.slice(0, 1024),
        }, {
          name: 'Delete messages',
          value: days ? `${days} day${days === 1 ? '' : 's'}` : '-',
        }]),
    ];

    const button = new MessageButton()
      .setCustomId(JSON.stringify({
        c: 'ban',
        sc: 'chunk',
        a: true,
      }))
      .setEmoji('⚠')
      .setLabel('Yes')
      .setStyle('PRIMARY');

    const components = [
      new MessageActionRow().setComponents([button]),
    ];

    await interaction.editReply({ components, embeds });
  }
}