import { Client, ModalSubmitInteraction } from 'discord.js';
import { ModalSubmit } from '../../structures';

export default class extends ModalSubmit {
  constructor(client: Client) {
    super(client, {
      name: 'kick',
      description: 'Kick a user',
    });
  }

  async execute(interaction: ModalSubmitInteraction<'cached'>) {
    const { customId, fields, guild, locale, member } = interaction;

    const { userId } = JSON.parse(customId);

    const user = await guild.members.fetch(userId);

    if (!(user.kickable && this.isKickable({ author: member, guild, target: user })))
      return await interaction.reply({
        content: this.t('kickHierarchyError', { locale }),
        ephemeral: true,
      });

    const reason = `${member.displayName}: ${fields.getTextInputValue('reason') || '-'}`;

    try {
      await guild.members.kick(user, reason);

      await interaction.reply({
        content: this.t('userKicked', { locale }),
        ephemeral: true,
      });
    } catch {
      await interaction.reply({
        content: this.t('kickError', { locale }),
        ephemeral: true,
      });
    }
  }
}