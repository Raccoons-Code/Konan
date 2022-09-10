import { ChatInputCommandInteraction, GuildTextBasedChannel, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import { SlashCommand } from '../../structures';

export default class Clear extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['ManageMessages', 'ReadMessageHistory'],
      userPermissions: ['ManageMessages'],
    });

    this.data = new SlashCommandBuilder().setName('clear')
      .setDescription('Deletes up to 1000 channel messages at once.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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

  async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    const { client, locale, member, options } = interaction;

    const channel = <GuildTextBasedChannel>options.getChannel('channel') ?? interaction.channel;

    const userPerms = channel.permissionsFor(member).missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserChannelPermission');

    const appPerms = channel.permissionsFor(client.user!)?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const limit = options.getInteger('amount', true);

    await interaction.deferReply({ ephemeral: true });

    try {
      const size = await this.bulkDelete(channel, limit);

      return interaction.editReply(this.t(size ? 'messageDeleted' : 'noDeletedMessages', {
        count: size,
        locale,
        size,
      }));
    } catch {
      return interaction.editReply(this.t('messageDeleteError', { locale }));
    }
  }

  async bulkDelete(channel: GuildTextBasedChannel, amount = 0, count = 0) {
    for (let i = 0; i < amount;) {
      const limit = amount - count > 100 ? 100 : amount - count;

      const deletedMessages = await channel.bulkDelete(limit, true);

      if (!deletedMessages.size) break;

      i = count += deletedMessages.size;

      await waitAsync(2000);
    }

    return count;
  }
}