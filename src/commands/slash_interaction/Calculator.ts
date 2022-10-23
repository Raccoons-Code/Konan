import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, codeBlock, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
    });

    this.data.setName('calculator')
      .setDescription('Opens a calculator');
  }

  build() {
    return this.data;
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const result = 0;

    return interaction.reply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: 'C' }))
              .setLabel('C')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '<' }))
              .setLabel('<')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: 'x²' }))
              .setLabel('x²')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '/' }))
              .setLabel('/')
              .setStyle(ButtonStyle.Primary),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '7' }))
              .setLabel('7')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '8' }))
              .setLabel('8')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '9' }))
              .setLabel('9')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '*' }))
              .setLabel('*')
              .setStyle(ButtonStyle.Primary),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '4' }))
              .setLabel('4')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '5' }))
              .setLabel('5')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '6' }))
              .setLabel('6')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '-' }))
              .setLabel('-')
              .setStyle(ButtonStyle.Primary),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '1' }))
              .setLabel('1')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '2' }))
              .setLabel('2')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '3' }))
              .setLabel('3')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '+' }))
              .setLabel('+')
              .setStyle(ButtonStyle.Primary),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '+/-' }))
              .setLabel('+/-')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '0' }))
              .setLabel('0')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '.' }))
              .setLabel(',')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'calculator', k: '=' }))
              .setLabel('=')
              .setStyle(ButtonStyle.Success),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(codeBlock(`${result}`.padStart(30))),
      ],
      ephemeral: true,
    });
  }
}