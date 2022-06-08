import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { Client, MessageActionRow, Modal, Permissions, TextInputComponent, UserContextMenuInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Kick extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Kick')
      .setNameLocalizations(this.getLocalizations('kickName'))
      .setType(2)
      .setDMPermission(false)
      .setDefaultMemberPermissions(Permissions.FLAGS.KICK_MEMBERS);
  }

  async execute(interaction: UserContextMenuInteraction) {
    const { options } = interaction;

    const user = options.getUser('user', true);

    await interaction.showModal(
      new Modal()
        .setCustomId(JSON.stringify({ c: 'kick', userId: user.id }))
        .setTitle(`Kick ${user.tag}`)
        .setComponents(...[
          new MessageActionRow<TextInputComponent>()
            .setComponents([
              new TextInputComponent()
                .setCustomId('reason')
                .setLabel('Reason')
                .setPlaceholder('Reason for kick...')
                .setStyle('PARAGRAPH'),
            ]),
        ]),
    );
  }
}