import { ActionRowBuilder, ApplicationCommandType, ContextMenuCommandBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Ban extends UserContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Ban')
      .setNameLocalizations(this.getLocalizations('banName'))
      .setType(ApplicationCommandType.User)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { targetMember } = interaction;

    return interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: 'ban', userId: targetMember.id }))
        .setTitle(`Ban ${targetMember.displayName}`)
        .setComponents(...[
          new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason')
                .setMaxLength(512)
                .setPlaceholder('Reason for ban...')
                .setStyle(TextInputStyle.Paragraph),
            ]),
          new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('days')
                .setLabel('Days of message deletion')
                .setMaxLength(1)
                .setPlaceholder('Max of 7 days')
                .setStyle(TextInputStyle.Short),
            ]),
        ]),
    );
  }
}