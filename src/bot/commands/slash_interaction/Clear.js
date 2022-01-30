const { SlashCommandBuilder, SlashCommandChannelOption } = require('@discordjs/builders');
const { CommandInteraction, Constants } = require('discord.js');
const { Client } = require('../../classes');
const { GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT } = Constants.ChannelTypes;

module.exports = class extends SlashCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
    this.data = this.setName('clear')
      .setDescription('Deletes up to 100 channel messages at once.')
      .addNumberOption(option => option.setName('amount')
        .setDescription('Amount of messages.')
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a channel to clear.')
        .addChannelTypes([GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PRIVATE_THREAD, GUILD_PUBLIC_THREAD, GUILD_STORE, GUILD_TEXT]));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { locale, memberPermissions, options } = interaction;

    if (!memberPermissions.has('MANAGE_MESSAGES'))
      return interaction.editReply(this.t('You do not have permission to manage messages from the server.',
        { locale }));

    const channel = options.getChannel('channel') || interaction.channel;

    const limit = options.getNumber('amount');

    channel.bulkDelete(limit, true).then(({ size }) =>
      interaction.editReply(this.t(size ? '{{size}} message successfully deleted!' : 'No deleted messages!',
        { count: size, locale, size })))
      .catch(() => interaction.editReply(this.t('Error! One or more messages could not be deleted.', { locale })));
  }
};