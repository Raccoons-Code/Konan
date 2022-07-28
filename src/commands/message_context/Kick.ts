import { ActionRowBuilder, ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import { MessageContextMenu } from '../../structures';

export default class Kick extends MessageContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Kick')
      .setNameLocalizations(this.getLocalizations('kickName'))
      .setType(ApplicationCommandType.Message)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
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
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ]),
    );
  }
}