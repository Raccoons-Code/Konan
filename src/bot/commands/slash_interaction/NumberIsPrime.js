const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../structures');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('number_is_prime')
      .setDescription('Verify if number is prime.')
      .addIntegerOption(option => option.setName('number')
        .setDescription('Write a integer. Below 1,000,000,000 shows all numbers.')
        .setMaxValue(999999999999999)
        .setMinValue(2)
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { locale, options } = interaction;

    const number = options.getInteger('number');

    const prime = this.primeResolve(number, { all: number < 1000000000 }); // 1000000000

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(prime.length ? `${number} is not prime.` : `${number} is prime!`)
      .setDescription(prime.length ?
        `It is divisible by \`\`\`${prime.join(', ').match(this.regexp.content)[1]}\`\`\`` : '')];

    await interaction.editReply({ embeds });
  }

  /**
   * @param {number} number
   * @param {PrimeResolveOptions} [options]
   * @returns {number[]}
   */
  primeResolve(number, options = {}) {
    if (!(number % 2)) return [2];

    const half = number / 2;

    if (options.all) {
      const array = [];

      for (let i = 3; i < half; i += 2) {
        if (!(number % i)) array.push(i);
      }

      return array;
    }

    for (let i = 3; i < half; i += 2) {
      if (!(number % i)) return [i];
    }
  }
};

/**
 * @typedef PrimeResolveOptions
 * @property {boolean} all
 */