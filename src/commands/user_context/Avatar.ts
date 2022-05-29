import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { Client, GuildMember, MessageActionRow, MessageButton, MessageEmbed, UserContextMenuInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Avatar extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('Get Avatar')
      .setType(2);
  }

  async execute(interaction: UserContextMenuInteraction) {
    const { options } = interaction;

    const user = options.getUser('user');
    const member = <GuildMember>options.getMember('user');

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`${user}`)
        .setImage(member?.displayAvatarURL({ dynamic: true, size: 512 }) ??
          user?.displayAvatarURL({ dynamic: true, size: 512 })),
    ];

    const buttons = [
      new MessageButton()
        .setStyle('LINK')
        .setLabel('Link')
        .setEmoji('🖼')
        .setURL(member?.displayAvatarURL({ dynamic: true, size: 4096 }) ??
          user?.displayAvatarURL({ dynamic: true, size: 4096 })),
    ];

    const components = [new MessageActionRow().setComponents(buttons)];

    await interaction.reply({ components, embeds });
  }
}