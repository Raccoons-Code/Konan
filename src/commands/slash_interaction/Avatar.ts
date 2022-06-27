import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember, SlashCommandBuilder, User } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Avatar extends SlashCommand {
  constructor(client: Client) {
    super(client, {
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

  async execute(interaction: ChatInputCommandInteraction) {
    const { options } = interaction;

    const user = <GuildMember | User>options.getMember('user') ?? interaction.member ?? interaction.user;

    return interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents([
            new ButtonBuilder()
              .setLabel('Link')
              .setStyle(ButtonStyle.Link)
              .setURL(user.displayAvatarURL({ size: 4096 })),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${user}`)
          .setImage(user.displayAvatarURL({ size: 512 })),
      ],
    });
  }
}