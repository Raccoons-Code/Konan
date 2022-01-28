const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.data = this.setName('echo')
      .setDescription('Replies with your message!')
      .addStringOption(option => option.setName('message')
        .setDescription('Message to echo back.')
        .setRequired(true));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    const { client, channel, member, options, user } = interaction;

    const message = options.getString('message');

    const username = member.nickname || user.username;

    const avatarURL = user.displayAvatarURL();

    const webhook = await channel.fetchWebhooks().then(w => w.find(v => v.name === client.user.id)) ||
      await channel.createWebhook(client.user.id);

    await webhook.send({ avatarURL, content: `${message}`, username });

    await interaction.reply({ content: 'Right!', ephemeral: true });
  }
};