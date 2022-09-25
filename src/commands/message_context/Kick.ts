import { ActionRowBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import { MessageContextMenu } from '../../structures';

export default class Kick extends MessageContextMenu {
  constructor() {
    super();

    this.data.setName('Kick');
  }

  build() {
    return this.data
      .setType(ApplicationCommandType.Message)
      .setNameLocalizations(this.getLocalizations('kickName'))
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
  }

  async execute(interaction: MessageContextMenuCommandInteraction<'cached'>) {
    const { targetMessage } = interaction;

    return interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: 'kick', userId: targetMessage.author.id }))
        .setTitle(`Kick ${targetMessage.member?.displayName ?? targetMessage.author.username}`)
        .setComponents([
          new ActionRowBuilder<TextInputBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason')
                .setMaxLength(512)
                .setPlaceholder('Reason for kick...')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(targetMessage.url),
            ]),
        ]),
    );
  }
}