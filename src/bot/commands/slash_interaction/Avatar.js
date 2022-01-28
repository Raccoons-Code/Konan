const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.data = this.setName('avatar')
      .setDescription('Replies with the user\'s profile picture.')
      .addUserOption(option => option.setName('user')
        .setDescription('Select user.'));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
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