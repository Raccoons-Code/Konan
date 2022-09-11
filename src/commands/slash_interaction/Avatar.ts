import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder, User } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Avatar extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('avatar')
      .setDescription('Replies with the user\'s profile picture.')
      .setNameLocalizations(this.getLocalizations('avatarName'))
      .setDescriptionLocalizations(this.getLocalizations('avatarDescription'))
      .addUserOption(option => option.setName('user')
        .setDescription('Select a user to get their profile picture.')
        .setNameLocalizations(this.getLocalizations('avatarUserName'))
        .setDescriptionLocalizations(this.getLocalizations('avatarUserDescription')));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { options } = interaction;

    const member = options.getMember('user') ?? interaction.member;
    const user = options.getUser('user') ?? interaction.user;
    const target = <GuildMember | User>member ?? user;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setEmoji('🖼')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link)
            .setURL(target.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    if (member?.avatar && member.avatar !== user.avatar)
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: 'avatar',
            id: user.id,
            next: 'user',
          }))
          .setLabel('User avatar')
          .setStyle(ButtonStyle.Secondary),
      );

    const avatar = user.displayAvatarURL().split('/').pop();

    return interaction.reply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(member?.displayColor ?? user.accentColor ?? 'Random')
          .setDescription(`${user}`)
          .setImage(`attachment://${avatar}`),
      ],
      ephemeral: true,
      files: [
        new AttachmentBuilder(target.displayAvatarURL({ size: 512 }), { name: avatar }),
      ],
    });
  }
}