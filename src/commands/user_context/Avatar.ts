import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, EmbedBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Avatar extends UserContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Get Avatar')
      .setType(ApplicationCommandType.User);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { targetMember, targetUser } = interaction;

    const target = targetMember ?? targetUser;

    return interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents([
            new ButtonBuilder()
              .setEmoji('🖼')
              .setLabel('Link')
              .setStyle(ButtonStyle.Link)
              .setURL(target.displayAvatarURL({ size: 4096 })),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${targetUser}`)
          .setImage(target.displayAvatarURL({ size: 512 })),
      ],
    });
  }
}