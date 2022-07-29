import { ModalSubmitInteraction } from 'discord.js';
import { ModalSubmit } from '../../structures';

export default class Ban extends ModalSubmit {
  constructor() {
    super({
      name: 'ban',
      description: 'Ban a user',
    });
  }

  async execute(interaction: ModalSubmitInteraction<'cached'>) {
    const { customId, fields, guild, locale, member } = interaction;

    const { userId } = JSON.parse(customId);

    const user = await guild.members.fetch(userId);

    if (!(user.bannable && user.isBannableBy(member)))
      return interaction.reply({
        content: this.t('banHierarchyError', { locale }),
        ephemeral: true,
      });

    const days = parseInt(fields.getTextInputValue('days'));

    const deleteMessageDays = Math.max(0, Math.min(7, days));

    const reason = `${member.displayName}: ${fields.getTextInputValue('reason') || '-'}`.slice(0, 512);

    try {
      await guild.bans.create(userId, { deleteMessageDays, reason });

      return interaction.reply({
        content: this.t('userBanned', { locale }),
        ephemeral: true,
      });
    } catch {
      return interaction.reply({
        content: this.t('banError', { locale }),
        ephemeral: true,
      });
    }
  }
}