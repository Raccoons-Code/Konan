const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('notícias_de_jogos')
      .setDescription('Novidades do mundo dos games.')
      .addStringOption(option => option.setName('notícia')
        .setDescription('Selecione a notícia.')
        .setAutocomplete(true)
        .setRequired(true));
    if (this.client?.ready)
      this.fetchnews();
    this.cache = { user: {}, news: {} };
  }

  async execute(interaction = this.CommandInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { options, user } = interaction;

    const index = options.getString('notícia');

    const news = this.cache.news[this.cache.user[user.id]];

    const cache = news[index] || news.find(gnew => gnew.title.match(index));

    if (!cache)
      return interaction.editReply('Desculpe, não encontrei a notícia, por favor, tente novamente.');

    const { title, paragraphs } = cache;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(title.match(/([\w\W]{0,256})/)[1])
      .setDescription(paragraphs.join('\n\n').match(/([\w\W]{0,4096})/)[1])];

    interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { options, user } = interaction;

    const pattern = this.cache.user[user.id] = options.getFocused();

    const regex = RegExp(pattern, 'i');

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
    } catch {
      console.error('game-news-api error.');
    }

    setTimeout(() => {
      this.fetchnews();
    }, 3600000);
  }
};