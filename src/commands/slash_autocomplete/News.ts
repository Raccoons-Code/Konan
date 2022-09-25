import axios from 'axios';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { journals, languages } from '../../modules/News';
import { SlashAutocomplete } from '../../structures';

export default class News extends SlashAutocomplete {
  [x: string]: any;

  constructor() {
    super({
      name: 'news',
      description: 'Show news from a journal. Use `/news [category | language] <journal> <new>`',
    });
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

  async categoryAutocomplete(
    interaction: AutocompleteInteraction,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const { options } = interaction;

    const journal = options.getString('journal');
    const language = options.getString('language');
    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`);

    const categories = journals.filter(j => journal ? j.name === journal : true)
      .filter(j => language ? j.languages.includes(language) : true)
      .map(j => j.categories.filter(c => pattern.test(c))).flat();

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      res.push({
        name: `${category}`,
        value: `${category}`,
      });

      if (res.length === 25) break;
    }

    return res;
  }

  async journalAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { options } = interaction;

    const category = options.getString('category');
    const language = options.getString('language');
    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`);

    const _journals = journals.filter(j => category ? j.categories.includes(category) : true)
      .filter(j => language ? j.languages.includes(language) : true)
      .filter(j => pattern.test(j.name));

    for (let i = 0; i < _journals.length; i++) {
      const _journal = _journals[i];

      const name = [
        _journal.name,
        ' | langs: ', ..._journal.languages.map(l => languages[l]),
        ' | categories: ', ..._journal.categories,
      ].join('').slice(0, 100);

      res.push({
        name,
        value: `${_journal.name}`,
      });

      if (res.length === 25) break;
    }

    return res;
  }

  async languageAutocomplete(
    interaction: AutocompleteInteraction,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const { options } = interaction;

    const category = options.getString('category');
    const journal = options.getString('journal');
    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`);

    const _languages = journals.filter(j => category ? j.categories.includes(category) : true)
      .filter(j => journal ? j.name === journal : true)
      .map(j => j.languages.filter(l => pattern.test(l))).flat();

    for (let i = 0; i < _languages.length; i++) {
      const language = _languages[i];

      res.push({
        name: `${languages[language]} - ${language}`,
        value: `${language}`,
      });

      if (res.length === 25) break;
    }

    return res;
  }

  async newAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    const { options } = interaction;

    const _journal = options.getString('journal');
    const focused = options.getFocused(true);
    const pattern = RegExp(`${focused.value}`);

    const journal = journals.find(j => j.name === _journal);

    if (!journal) return res;

    const news = await axios.get(journal.url).then(r => r.data) as any[];

    const _news = news.filter(n => pattern.test(n[journal.properties.title]));

    for (let i = 0; i < _news.length; i++) {
      const _new = _news[i];

      res.push({
        name: `${_new[journal.properties.title].slice(0, 100)}`,
        value: `${i}`,
      });
    }

    return res;
  }
}