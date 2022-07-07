import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import { SlashCommand } from '../../structures';

export default class Clear extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      clientPermissions: ['ManageMessages', 'ReadMessageHistory'],
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

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return interaction.editReply({ content: this.t('onlyOnServer', { locale }) });

    const { client, member, options } = interaction;

    const channel = <TextChannel>options.getChannel('channel') ?? interaction.channel;

    const userPerms = channel.permissionsFor(member).missing(this.props!.userPermissions!);

    if (userPerms.length)
      return interaction.editReply(this.t('missingUserChannelPermission', {
        locale,
        permission: this.t(userPerms[0], { locale }),
      }));

    const clientPerms = channel.permissionsFor(client.user!)?.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingChannelPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const limit = options.getInteger('amount', true);

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

  async bulkDelete(channel: TextChannel, amount = 0, count = 0) {
    for (let i = 0; i < amount;) {
      const limit = amount - count > 100 ? 100 : amount - count;

      const { size } = await channel.bulkDelete(limit, true);

      if (!size) break;

      i = count += size;

      await waitAsync(500);
    }

    return count;
  }
}