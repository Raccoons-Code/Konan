const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, AutocompleteInteraction, MessageEmbed } = require('discord.js');
const { Client } = require('../../classes');
const fetch = require('node-fetch');

module.exports = class extends SlashCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.data = this.setName('notícias_de_jogos')
      .setDescription('Novidades do mundo dos games.')
      .setDefaultPermission(true)
      .addNumberOption(option => option.setName('notícia')
        .setDescription('Selecione a notícia.')
        .setAutocomplete(true)
        .setRequired(true));
    if (client.t)
      this.fetchnews();
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete();

    const { options } = interaction;

    const index = options.getNumber('notícia');

    const game_new = this.game_news[index];

    if (!game_new)
      return interaction.reply({
        content: 'Desculpe, não encontrei a notícia, por favor, tente novamente.',
        ephemeral: true,
      });

    this.embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(game_new.title)
      .setDescription(game_new.paragraphs?.join('\n\n'))];

    interaction.reply({ embeds: [...this.embeds], ephemeral: true });
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const res = [];

    this.game_news.forEach((game_new, index) => res.push({
      name: game_new.title,
      value: index,
    }));

    interaction.respond(res);
  }

  async fetchnews() {
    try {
      fetch('https://game-news-api.herokuapp.com/all')
        .then(async response => this.game_news = await response.json());
    } catch (error) {
      console.error('game-news-api error.');
    }

    setTimeout(() => {
      this.fetchnews();
    }, 1000 * 60 * 60 * 24);
  }
};