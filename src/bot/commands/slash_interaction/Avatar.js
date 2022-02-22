const { SlashCommand } = require('../../classes');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('avatar')
      .setDescription('Replies with the user\'s profile picture.')
      .addUserOption(option => option.setName('user')
        .setDescription('Select user.'));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options } = interaction;

    const user = options.getUser('user') || interaction.user;
    const member = options.getMember('user') || interaction.member;

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
};