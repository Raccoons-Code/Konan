import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { Client, MessageActionRow, MessageButton, MessageEmbed, UserContextMenuInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Avatar extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Get Avatar')
      .setType(2);
  }

  async execute(interaction: UserContextMenuInteraction<'cached'>) {
    const { targetMember, targetUser } = interaction;

    await interaction.reply({
      components: [
        new MessageActionRow()
          .setComponents([
            new MessageButton()
              .setStyle('LINK')
              .setLabel('Link')
              .setEmoji('🖼')
              .setURL(targetMember?.displayAvatarURL({ dynamic: true, size: 4096 }) ??
                targetUser?.displayAvatarURL({ dynamic: true, size: 4096 })),
          ]),
      ],
      embeds: [
        new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(`${targetUser}`)
          .setImage(targetMember?.displayAvatarURL({ dynamic: true, size: 512 }) ??
            targetUser?.displayAvatarURL({ dynamic: true, size: 512 })),
      ],
    });
  }
}