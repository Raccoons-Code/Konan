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
      .addStringOption(option => option.setName('notícia')
        .setDescription('Selecione a notícia.')
        .setAutocomplete(true)
        .setRequired(true));
    if (client.ready)
      this.fetchnews();
    this.cache = { user: {}, news: {} };
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    const { options, user } = interaction;

    const index = options.getString('notícia');

    const news = this.cache.news[this.cache.user[user.id]];

    const cache = news[index] || news.find(gnew => gnew.title.match(index));

    if (!cache)
      return interaction.reply({
        content: 'Desculpe, não encontrei a notícia, por favor, tente novamente.',
        ephemeral: true,
      });

    const { title, paragraphs } = cache;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(title)
      .setDescription(paragraphs?.join('\n\n'))];

    interaction.reply({ embeds, ephemeral: true });
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction) {
    if (interaction.responded) return;

    const { options, user } = interaction;

    const pattern = this.cache.user[user.id] = options.getFocused();

    const regex = RegExp(pattern, 'i');

    const res = [];

    const game_news = this.cache.news[pattern] = pattern ?
      this.game_news?.filter(gnew => regex.test(gnew.title)) : this.game_news;

    for (let i = 0; i < game_news?.length; i++) {
      const game_new = game_news[i];

      res.push({ name: game_new.title, value: `${i}` });

      if (i === 24) break;
    }

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
    }, 3600000);
  }
};