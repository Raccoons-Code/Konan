import { ActionRowBuilder, ApplicationCommandType, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, User, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class Avatar extends UserContextMenu {
  constructor() {
    super();

    this.data.setName('Get Avatar');
  }

  build() {
    return this.data
      .setType(ApplicationCommandType.User);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { targetMember, targetUser } = interaction;

    const target = <GuildMember | User>targetMember ?? targetUser;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji('🖼')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link)
            .setURL(target.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    if (targetMember?.avatar && targetMember.avatar !== targetUser.avatar)
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: 'avatar',
            id: targetUser.id,
            next: 'user',
          }))
          .setLabel('User avatar')
          .setStyle(ButtonStyle.Secondary),
      );

    const avatar = target.displayAvatarURL().split('/').pop();

    return interaction.reply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(targetMember?.displayColor ?? targetUser.accentColor ?? 'Random')
          .setDescription(`${target}`)
          .setImage(`attachment://${avatar}`),
      ],
      ephemeral: true,
      files: [
        new AttachmentBuilder(target.displayAvatarURL({ size: 512 }), { name: avatar }),
      ],
    });
  }
}