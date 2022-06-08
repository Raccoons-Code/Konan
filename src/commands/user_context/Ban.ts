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

  async execute(interaction: UserContextMenuInteraction) {
    const { options } = interaction;

    const user = options.getUser('user', true);

    await interaction.showModal(
      new Modal()
        .setCustomId(JSON.stringify({ c: 'ban', userId: user.id }))
        .setTitle(`Ban ${user.tag}`)
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