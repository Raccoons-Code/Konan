import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
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

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    const user = options.getUser('user') ?? interaction.user;
    const member = <GuildMember>options.getMember('user') ?? interaction.member;

    return interaction.reply({
      components: [
        new MessageActionRow()
          .setComponents([
            new MessageButton()
              .setLabel('Link')
              .setStyle('LINK')
              .setURL(member?.displayAvatarURL({ dynamic: true, size: 4096 }) ??
                user.displayAvatarURL({ dynamic: true, size: 4096 })),
          ]),
      ],
      embeds: [
        new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(`${member ?? user}`)
          .setImage(member?.displayAvatarURL({ dynamic: true, size: 512 }) ??
            user.displayAvatarURL({ dynamic: true, size: 512 })),
      ],
    });
  }
}