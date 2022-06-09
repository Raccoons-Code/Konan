import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { Client, MessageActionRow, Modal, Permissions, TextInputComponent, UserContextMenuInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Ban extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Ban')
      .setNameLocalizations(this.getLocalizations('banName'))
      .setType(2)
      .setDMPermission(false)
      .setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS);
  }

  async execute(interaction: UserContextMenuInteraction<'cached'>) {
    const { targetMember } = interaction;

    await interaction.showModal(
      new Modal()
        .setCustomId(JSON.stringify({ c: 'ban', userId: targetMember.id }))
        .setTitle(`Ban ${targetMember.displayName}`)
        .setComponents(...[
          new MessageActionRow<TextInputComponent>()
            .setComponents([
              new TextInputComponent()
                .setCustomId('reason')
                .setLabel('Reason')
                .setPlaceholder('Reason for ban...')
                .setStyle('PARAGRAPH'),
            ]),
          new MessageActionRow<TextInputComponent>()
            .setComponents([
              new TextInputComponent()
                .setCustomId('days')
                .setLabel('Days of message deletion')
                .setMaxLength(1)
                .setPlaceholder('Max of 7 days')
                .setStyle('SHORT'),
            ]),
        ]),
    );
  }
}