const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../structures');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('number_is_prime')
      .setDescription('Verify if number is prime.')
      .addIntegerOption(option => option.setName('number')
        .setDescription('Write a integer.')
        .setMaxValue(999999999999999)
        .setMinValue(2)
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const number = options.getInteger('number');

    const prime = this.primeResolve(number);

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(prime ? `${number} is not prime.` : `${number} is prime!`)
      .setDescription(prime ? `It is divisible by ${prime}.` : '')];

    await interaction.reply({ embeds, ephemeral: true });
  }

  primeResolve(number) {
    if (!(number % 2)) return 2;

    const half = number / 2;

    for (let i = 3; i < half; i += 2) {
      if (!(number % i)) return i;
    }
  }
};