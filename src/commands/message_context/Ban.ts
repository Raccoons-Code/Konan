import { ActionRowBuilder, ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import { MessageContextMenu } from '../../structures';

export default class Ban extends MessageContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Ban')
      .setNameLocalizations(this.getLocalizations('banName'))
      .setType(ApplicationCommandType.Message)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }

  async execute(interaction: MessageContextMenuCommandInteraction<'cached'>) {
    const { targetMessage } = interaction;

    return interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: 'ban', userId: targetMessage.author.id }))
        .setTitle(`Ban ${targetMessage.member?.displayName ?? targetMessage.author.username}`)
        .setComponents([
          new ActionRowBuilder<TextInputBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason')
                .setMaxLength(512)
                .setPlaceholder('Reason for ban...')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(targetMessage.url),
            ]),
          new ActionRowBuilder<TextInputBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('hours')
                .setLabel('Hours of message deletion')
                .setMaxLength(3)
                .setPlaceholder('Max of 7 days (168 hours)')
                .setStyle(TextInputStyle.Short),
            ]),
        ]),
    );
  }
}