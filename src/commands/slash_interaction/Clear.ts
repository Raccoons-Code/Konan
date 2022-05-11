import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionString, TextChannel, User } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Clear extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
      userPermissions: ['MANAGE_MESSAGES'],
    });

    this.data = new SlashCommandBuilder().setName('clear')
      .setDescription('Deletes up to 1000 channel messages at once.')
      .setNameLocalizations(this.getLocalizations('clearName'))
      .setDescriptionLocalizations(this.getLocalizations('clearDescription'))
      .addIntegerOption(option => option.setName('amount')
        .setDescription('The amount of messages to delete.')
        .setNameLocalizations(this.getLocalizations('clearAmountOptionName'))
        .setDescriptionLocalizations(this.getLocalizations('clearAmountOptionDescription'))
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a channel to clear.')
        .setNameLocalizations(this.getLocalizations('clearChannelOptionName'))
        .setDescriptionLocalizations(this.getLocalizations('clearChannelOptionDescription'))
        .addChannelTypes(...this.GuildTextChannelTypes));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply({ content: this.t('onlyOnServer', { locale }) });

    const { client, member, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;

    const userPermissions =
      channel.permissionsFor(member).missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (userPermissions.length)
      return await interaction.editReply(this.t('missingUserChannelPermission', {
        locale,
        PERMISSIONS: userPermissions,
      }));

    const clientPermissions = channel.permissionsFor(<User>client.user)
      ?.missing(this.props?.clientPermissions as PermissionString[]) ?? [];

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingChannelPermission', {
        locale,
        PERMISSIONS: clientPermissions,
      }));

    const limit = options.getInteger('amount', true);

    try {
      const size = await this.bulkDelete(channel, limit);

      await interaction.editReply(this.t(size ? 'messageDeleted' : 'noDeletedMessages', {
        count: size,
        locale,
        size,
      }));
    } catch {
      await interaction.editReply(this.t('messageDeleteError', { locale }));
    }
  }

  async bulkDelete(channel: TextChannel, number = 0, count = 0) {
    if (number < 1) return count;

    const limit = number > 100 ? 100 : number;

    const { size } = await channel.bulkDelete(limit, true);

    size && await this.Util.waitAsync(500);

    const go = size && (number - size);

    count = go ? await this.bulkDelete(channel, (number - size), (count + size)) : count + size;

    return count;
  }
}