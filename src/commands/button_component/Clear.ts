import { ButtonInteraction, GuildTextBasedChannel, Message } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import { ButtonComponentInteraction } from '../../structures';

export default class extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'clear',
      description: 'clear',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { channel, client, customId, locale, member } = interaction;

    if (!channel?.isTextBased()) return;

    const userPerms = channel.permissionsFor(member).missing('ManageMessages');

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserChannelPermission');

    const appPerms = channel.permissionsFor(client.user!)?.missing('ManageMessages');

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    const { msgId } = JSON.parse(customId);

    await interaction.update({ components: [] });
    try {
      const targetMessage = await channel.messages.fetch(msgId);

      const size = await this.bulkDelete(channel, targetMessage);

      return interaction.editReply({
        content: this.t(size ? 'messageDeleted' : 'noDeletedMessages', {
          count: size,
          locale,
          size,
        }),
        embeds: [],
      });
    } catch {
      return interaction.editReply({
        content: this.t('messageDeleteError', {
          locale,
        }),
        embeds: [],
      });
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