import { codeBlock, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class NumberIsPrime extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('number_is_prime')
      .setDescription('Verify if number is prime.')
      .addIntegerOption(option => option.setName('number')
        .setDescription('Write a integer. Below 1,000,000,000 shows all numbers.')
        .setMaxValue(Number.MAX_SAFE_INTEGER)
        .setMinValue(2)
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const number = options.getInteger('number', true);

    const prime = this.primeResolve(number, { all: number < 1000000000 }); // 1.000.000.000

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(prime.length ? `${number} is not prime.` : `${number} is prime!`)
      .setDescription(<string>(prime.length ?
        `It is divisible by ${codeBlock(prime.join(', '))}` : '').match(this.pattern.content)?.[1])];

    await interaction.editReply({ embeds });
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

interface PrimeResolveOptions {
  all?: boolean
}