import { ActionRowBuilder, ApplicationCommandType, Client, ContextMenuCommandBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Kick extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Kick')
      .setNameLocalizations(this.getLocalizations('kickName'))
      .setType(ApplicationCommandType.User)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { targetMember } = interaction;

    return interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: 'kick', userId: targetMember.id }))
        .setTitle(`Kick ${targetMember.displayName}`)
        .setComponents(...[
          new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason')
                .setPlaceholder('Reason for kick...')
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ]),
    );
  }
}