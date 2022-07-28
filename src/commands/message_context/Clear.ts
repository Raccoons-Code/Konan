import { ApplicationCommandType, ContextMenuCommandBuilder, GuildTextBasedChannel, Message, MessageContextMenuCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import { MessageContextMenu } from '../../structures';

export default class extends MessageContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Clear up to here')
      .setType(ApplicationCommandType.Message)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }

  async execute(interaction: MessageContextMenuCommandInteraction) {
    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    const { channel, client, locale, member, targetMessage } = interaction;

    if (!channel?.isTextBased()) return;

    const userPerms = channel.permissionsFor(member).missing('ManageMessages');

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserChannelPermission');

    const appPerms = channel.permissionsFor(client.user!)?.missing('ManageMessages');

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    await interaction.deferReply({ ephemeral: true });
    try {
      const size = await this.bulkDelete(channel, targetMessage);

      return interaction.editReply(this.t(size ? 'messageDeleted' : 'noDeletedMessages', {
        count: size,
        locale,
        size,
      }));
    } catch {
      return interaction.editReply(this.t('messageDeleteError', { locale }));
    }
  }

  async bulkDelete(channel: GuildTextBasedChannel, targetMessage: Message, count = 0): Promise<number> {
    const messages = await channel.messages.fetch({ after: targetMessage.id, limit: 100 });

    await waitAsync(1000);
    const deletedMessages = await channel.bulkDelete(messages, true);

    if (deletedMessages.size < 100)
      try {
        await targetMessage.delete();

        return count + deletedMessages.size + 1;
      } catch {
        return count + deletedMessages.size;
      }

    await waitAsync(1000);
    return await this.bulkDelete(channel, targetMessage, count + deletedMessages.size);
  }
}