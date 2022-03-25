import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionString, TextChannel, User } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Clear extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
      userPermissions: ['MANAGE_MESSAGES'],
    });

    this.data = new SlashCommandBuilder().setName('clear')
      .setDescription('Deletes up to 1000 channel messages at once.')
      .addNumberOption(option => option.setName('amount')
        .setDescription('Amount of messages.')
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a channel to clear.')
        .addChannelTypes(this.GuildTextChannelTypes as any));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply({ content: this.t('onlyOnServer', { locale }) });

    const { client, member, options } = interaction;

    const channel = (options.getChannel('channel') || interaction.channel) as TextChannel;

    const userPermissions =
      channel.permissionsFor(member).missing(this.props?.userPermissions as PermissionString[]) || [];

    if (userPermissions.length)
      return await interaction.editReply(this.t('missingUserChannelPermission',
        { locale, PERMISSIONS: userPermissions }));

    const clientPermissions = channel.permissionsFor(client.user as User)
      ?.missing(this.props?.clientPermissions as PermissionString[]) || [];

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingChannelPermission',
        { locale, PERMISSIONS: clientPermissions }));

    const limit = options.getNumber('amount') as number;

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

    size && await this.util.waitAsync(500);

    const go = size && (number - size);

    count = go ? await this.bulkDelete(channel, (number - size), (count + size)) : count + size;

    return count;
  }
}