import translate, { languages } from '@vitalets/google-translate-api';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const Choices = <[string, string][]>Object.keys(languages)
  .filter(l => !/(isSupported|getCode)/.test(l))
  .map((l) => [languages[<'auto'>l], l]);

export default class Translate extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('translate')
      .setDescription('Translate text from one language to another. - Powered by Google Translate Api.');
  }

  async execute(interaction: AutocompleteInteraction): Promise<any> {
    return this.executeAutocomplete(interaction);
  }

  async executeAutocomplete(interaction: AutocompleteInteraction) {
    if (interaction.responded) return;

    const focused = interaction.options.getFocused(true);

    const response = await this[`${focused.name}Autocomplete`]?.(interaction);

    return interaction.respond(response);
  }

  async fromAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { locale, options } = interaction;

    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`, 'i');

    const fromChoices = Choices.filter(([A, a]) => pattern.test(A) || pattern.test(a))
      .sort((a, b) => RegExp(`${a[1]}|${b[1]}`).test('auto') ? 1 : RegExp(a[1]).test(locale) ? -1 : 1);

    for (let i = 0; i < fromChoices.length; i++) {
      const choice = fromChoices[i];

      res.push({
        name: choice[0],
        value: choice[1],
      });

      if (res.length === 25) break;
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
      .sort((a) => RegExp(a[1]).test(locale) ? -1 : 1);

    for (let i = 0; i < toChoices.length; i++) {
      const choice = toChoices[i];

      res.push({
        name: choice[0],
        value: choice[1],
      });

      if (res.length === 25) break;
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

    const name = [
      translation.text,
      ' (', translation.from.language.iso.toUpperCase(), ' -> ', to.toUpperCase(), ')',
    ].join('').slice(0, 100);

    res.push({
      name,
      value: varJson,
    });

    return res;
  }
}