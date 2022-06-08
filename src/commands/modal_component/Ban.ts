import { Client, Guild, GuildMember, ModalSubmitInteraction } from 'discord.js';
import { ModalSubmit } from '../../structures';

export default class extends ModalSubmit {
  constructor(client: Client) {
    super(client, {
      name: 'ban',
      description: 'Ban a user',
    });
  }

  async execute(interaction: ModalSubmitInteraction<'cached'>): Promise<any> {
    const { customId, fields, guild, locale, member } = interaction;

    const { userId } = JSON.parse(customId);

    const user = await guild.members.fetch(userId);

    if (!(user.bannable && this.isBannable({ author: member, guild, target: user })))
      return await interaction.reply({
        content: this.t('banHierarchyError', { locale }),
        ephemeral: true,
      });

    const d = parseInt(fields.getTextInputValue('days'));

    const days = d > 0 ? Math.min(d, 7) : 0;

    const reason = `Author: ${member.displayName}. Reason: ${fields.getTextInputValue('reason') || '-'}`;

    try {
      await guild.bans.create(userId, { days, reason });

      await interaction.reply({
        content: this.t('userBanned', { locale }),
        ephemeral: true,
      });
    } catch {
      await interaction.reply({
        content: this.t('banError', { locale }),
        ephemeral: true,
      });
    }
  }
}