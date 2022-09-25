import translate, { languages } from '@vitalets/google-translate-api';
import { ChatInputCommandInteraction, codeBlock, EmbedBuilder } from 'discord.js';
import { cache } from '../../modules/Cache';
import { SlashCommand } from '../../structures';

export default class Translate extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Utility',
    });

    this.data.setName('translate')
      .setDescription('Translate text from one language to another. - Powered by Google Translate Api.');
  }

  build() {
    return this.data
      .setNameLocalizations(this.getLocalizations('translateName'))
      .setDescriptionLocalizations(this.getLocalizations('translateDescription'))
      .addStringOption(option => option.setName('from')
        .setDescription('The language to translate from.')
        .setNameLocalizations(this.getLocalizations('translateFromName'))
        .setDescriptionLocalizations(this.getLocalizations('translateFromDescription'))
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('to')
        .setDescription('The language to translate to.')
        .setNameLocalizations(this.getLocalizations('translateToName'))
        .setDescriptionLocalizations(this.getLocalizations('translateToDescription'))
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('text')
        .setDescription('The text to translate.')
        .setNameLocalizations(this.getLocalizations('translateTextName'))
        .setDescriptionLocalizations(this.getLocalizations('translateTextDescription'))
        .setAutocomplete(true)
        .setRequired(true));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const from = options.getString('from', true);
    const to = <'auto'>options.getString('to', true);
    const text = options.getString('text', true);

    const cached = cache.get(text);

    const translation = await translate(cached || text, { from, to });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${codeBlock(translation.text.slice(0, 4089))}`)
          .setTitle([
            'Translation from',
            languages[<'auto'>translation.from.language.iso],
            'to',
            languages[to],
          ].join(' ')),
      ],
    });
  }
}