import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Avatar extends SlashCommand {
  constructor(client: Client) {
    super(client);

    this.data = new SlashCommandBuilder().setName('avatar')
      .setDescription('Replies with the user\'s profile picture.')
      .addUserOption(option => option.setName('user')
        .setDescription('Select user.'));
  }

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    const user = options.getUser('user') || interaction.user;
    const member = (options.getMember('user') || interaction.member) as GuildMember;

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(`${member || user}`)
      .setImage(member?.displayAvatarURL({ dynamic: true, size: 512 }) ||
        user.displayAvatarURL({ dynamic: true, size: 512 }))];

    const button = new MessageButton()
      .setLabel('Link')
      .setStyle('LINK')
      .setURL(member?.displayAvatarURL({ dynamic: true, size: 4096 }) ||
        user.displayAvatarURL({ dynamic: true, size: 4096 }));

    const components = [new MessageActionRow().setComponents(button)];

    await interaction.reply({ components, embeds });
  }
}