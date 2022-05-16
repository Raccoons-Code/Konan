import { codeBlock, SlashCommandBuilder } from '@discordjs/builders';
import translate, { languages } from '@vitalets/google-translate-api';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const Choices = <[string, string][]>Object.keys(languages)
  .filter(l => !/(isSupported|getCode)/.test(l))
  .map((l) => [languages[<'auto'>l], l]);

export default class Translate extends SlashCommand {
  cache = new Map();

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('translate')
      .setDescription('Translate text from one language to another. - Powered by Google Translate Api.')
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

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    if (interaction.isAutocomplete())
      return await this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const from = options.getString('from', true);
    const to = <'auto'>options.getString('to', true);
    const text = options.getString('text', true);

    const cache = this.cache.get(text);

    const translation = await translate(cache || text, { from, to });

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`${codeBlock(translation.text.slice(0, 4089))}`)
        .setTitle([
          'Translation from',
          languages[<'auto'>translation.from.language.iso],
          'to',
          languages[to],
        ].join(' ')),
    ];

    await interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { options } = interaction;

    const focused = options.getFocused(true);

    res = await this[`${<'from'>focused.name}Autocomplete`]?.(interaction);

    await interaction.respond(res);
  }

  async fromAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { locale, options } = interaction;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    const fromChoices = Choices.filter(([A, a]) => pattern.test(A) || pattern.test(a))
      .sort(([A, a], [B, b]) => RegExp(`${a}|${b}`).test('auto') ? 1 : RegExp(a).test(locale) ? -1 : 1);

    for (let i = 0; i < fromChoices.length; i++) {
      const choice = fromChoices[i];

      res.push({
        name: choice[0],
        value: choice[1],
      });

      if (res.length === 24) break;
    }

    return res;
  }

  async toAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { locale, options } = interaction;

    const from = options.getString('from', true);
    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    const toChoices = Choices.filter(([A, a]) =>
      !RegExp(`${from}|auto`, 'i').test(a) && (pattern.test(A) || pattern.test(a)))
      .sort(([A, a], [B, b]) => RegExp(a).test(locale) ? -1 : 1);

    for (let i = 0; i < toChoices.length; i++) {
      const choice = toChoices[i];

      res.push({
        name: choice[0],
        value: choice[1],
      });

      if (res.length === 24) break;
    }

    return res;
  }

  async textAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { options, user } = interaction;

    const from = options.getString('from', true);
    const to = options.getString('to', true);
    const focused = options.getFocused(true);

    if (!focused.value) return res;

    const varJson = JSON.stringify({ from, to, userId: user.id });

    this.cache.set(varJson, focused.value);

    const translation = await translate(`${focused.value}`, { from, to });

    const nameProps = [
      translation.text,
      ' (', translation.from.language.iso.toUpperCase(), ' -> ', to.toUpperCase(), ')',
    ];

    res.push({
      name: `${nameProps.join('').slice(0, 100)}`,
      value: varJson,
    });

    return res;
  }
}