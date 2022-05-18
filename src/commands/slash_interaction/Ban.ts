import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
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
      .setNameLocalizations(this.getLocalizations('banName'))
      .setDescriptionLocalizations(this.getLocalizations('banDescription'))
      .addSubcommand(subcommand => subcommand.setName('single')
        .setDescription('Bans a user.')
        .setNameLocalizations(this.getLocalizations('banSingleName'))
        .setDescriptionLocalizations(this.getLocalizations('banSingleDescription'))
        .addUserOption(option => option.setName('user')
          .setDescription('Select a user to ban.')
          .setNameLocalizations(this.getLocalizations('banSingleUserName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleUserDescription'))
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setNameLocalizations(this.getLocalizations('banSingleDeleteMessagesName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleDeleteMessagesDescription'))
          .setChoices({
            name: 'Last 24 hours',
            value: 1,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 7 days',
            value: 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banSingleReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleReasonDescription'))))
      .addSubcommand(subcommand => subcommand.setName('chunk')
        .setDescription('Bans a chunk of users from the server.')
        .setNameLocalizations(this.getLocalizations('banChunkName'))
        .setDescriptionLocalizations(this.getLocalizations('banChunkDescription'))
        .addStringOption(option => option.setName('users')
          .setDescription('Input a chunk of users to ban.')
          .setNameLocalizations(this.getLocalizations('banChunkUsersName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkUsersDescription'))
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setNameLocalizations(this.getLocalizations('banChunkDeleteMessagesName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkDeleteMessagesDescription'))
          .setChoices({
            name: 'Last 24 hours',
            value: 1,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 7 days',
            value: 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banChunkReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkReasonDescription'))));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!) ?? [];

    if (userPerms.length)
      return await interaction.editReply(this.t('missingUserPermission', { locale, permission: userPerms[0] }));

    const clientPerms = guild.me?.permissions.missing(this.props!.userPermissions!) ?? [];

    if (clientPerms.length)
      return await interaction.editReply(this.t('missingPermission', { locale, permission: clientPerms[0] }));

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

    const buttons = [
      new MessageButton()
        .setCustomId(JSON.stringify({
          c: 'ban',
          sc: 'chunk',
          a: true,
        }))
        .setEmoji('⚠')
        .setLabel('Yes')
        .setStyle('PRIMARY'),
    ];

    const components = [new MessageActionRow().setComponents(buttons)];

    await interaction.editReply({ components, embeds });
  }
}