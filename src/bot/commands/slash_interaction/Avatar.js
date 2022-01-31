const { SlashCommand } = require('../../classes');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('avatar')
      .setDescription('Replies with the user\'s profile picture.')
      .addUserOption(option => option.setName('user')
        .setDescription('Select user.'));
  }

  async execute(interaction = this.CommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const mButton = new MessageButton()
      .setLabel('Link')
      .setStyle('LINK')
      .setURL(user.avatarURL({ dynamic: true, format: 'png', size: 4096 }));

    const mRow = new MessageActionRow()
      .setComponents(mButton);

    const mEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(`${user}`)
      .setImage(user.avatarURL({ dynamic: true, format: 'png', size: 512 }));

    interaction.reply({ components: [mRow], embeds: [mEmbed] });
  }
};