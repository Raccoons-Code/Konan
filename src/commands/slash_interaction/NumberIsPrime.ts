import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { PrimeResolveOptions } from '../../@types';
import { SlashCommand } from '../../structures';

export default class NumberIsPrime extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('number_is_prime')
      .setDescription('Verify if number is prime.')
      .setNameLocalizations(this.getLocalizations('numberIsPrimeName'))
      .setDescriptionLocalizations(this.getLocalizations('numberIsPrimeDescription'))
      .addIntegerOption(option => option.setName('number')
        .setDescription('Write a integer. Below 1,000,000,000 shows all numbers.')
        .setNameLocalizations(this.getLocalizations('numberIsPrimeNumberName'))
        .setDescriptionLocalizations(this.getLocalizations('numberIsPrimeNumberDescription'))
        .setMaxValue(Number.MAX_SAFE_INTEGER)
        .setMinValue(2)
        .setRequired(true));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const number = options.getInteger('number', true);

    const prime = this.primeResolve(number, { all: number < 1000000000 }); // 1.000.000.000

    const embedDescription = 'It is divisible by ';

    const length = 4096 - (codeBlock('').length + embedDescription.length);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle(prime.length ? `${number} is not prime.` : `${number} is prime!`)
        .setDescription(prime.length ?
          `${embedDescription}${codeBlock(prime.join(', ').slice(0, length))}` : null),
    ];

    return interaction.editReply({ embeds });
  }

  primeResolve(number: number, options: PrimeResolveOptions = {}): number[] {
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

    return [];
  }
}