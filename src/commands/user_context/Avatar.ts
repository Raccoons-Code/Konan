import { ActionRowBuilder, ApplicationCommandType, AttachmentBuilder, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, EmbedBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Avatar extends UserContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Get Avatar')
      .setType(ApplicationCommandType.User);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { targetMember, targetUser } = interaction;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setEmoji('🖼')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link)
            .setURL(targetUser.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    if (targetMember?.avatar && targetMember.avatar !== targetUser.avatar)
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: 'avatar',
            id: targetUser.id,
            next: 'member',
          }))
          .setLabel('Member avatar')
          .setStyle(ButtonStyle.Secondary),
      );

    const avatar = targetUser.displayAvatarURL().split('/').pop();

    return interaction.reply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(targetUser.accentColor ?? 'Random')
          .setDescription(`${targetUser}`)
          .setImage(`attachment://${avatar}`),
      ],
      ephemeral: true,
      files: [
        new AttachmentBuilder(targetUser.displayAvatarURL({ size: 512 }), { name: avatar }),
      ],
    });
  }
}