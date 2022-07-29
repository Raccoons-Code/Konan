import { ModalSubmitInteraction } from 'discord.js';
import { ModalSubmit } from '../../structures';

export default class Kick extends ModalSubmit {
  constructor() {
    super({
      name: 'kick',
      description: 'Kick a user',
    });
  }

  async execute(interaction: ModalSubmitInteraction<'cached'>) {
    const { customId, fields, guild, locale, member } = interaction;

    const { userId } = JSON.parse(customId);

    const user = await guild.members.fetch(userId);

    if (!(user.kickable && user.isKickableBy(member)))
      return interaction.reply({
        content: this.t('kickHierarchyError', { locale }),
        ephemeral: true,
      });

    const reason = `${member.displayName}: ${fields.getTextInputValue('reason') || '-'}`.slice(0, 512);

    try {
      await guild.members.kick(user, reason);

      return interaction.reply({
        content: this.t('userKicked', { locale }),
        ephemeral: true,
      });
    } catch {
      return interaction.reply({
        content: this.t('kickError', { locale }),
        ephemeral: true,
      });
    }
  }
}