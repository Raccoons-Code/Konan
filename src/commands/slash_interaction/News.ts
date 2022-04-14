import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const journals = [{
  categories: ['games'],
  description: 'Novidades do mundo dos games.',
  name: 'Game News',
  languages: ['pt'],
  properties: {
    title: 'title',
    description: 'paragraphs',
  },
  url: 'https://game-news-api.herokuapp.com/all',
}];

const languages: { [k: string]: string } = {
  pt: 'Portuguese',
};

export default class News extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Fun',
    });

    this.data = new SlashCommandBuilder().setName('news')
      .setDescription('Show news from a journal. Use `/news [category | language] <journal> <new>`')
      .addStringOption(option => option.setName('category')
        .setDescription('Category of the journal.')
        .setAutocomplete(true))
      .addStringOption(option => option.setName('language')
        .setDescription('Language of the journal.')
        .setAutocomplete(true))
      .addStringOption(option => option.setName('journal')
        .setDescription('Journal to show news from.')
        .setAutocomplete(true))
      .addStringOption(option => option.setName('new')
        .setDescription('New to search. Select a journal before.')
        .setAutocomplete(true));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { locale, options } = interaction;

    const _journal = options.getString('journal');

    const _new = options.getString('new');

    if (!(_journal && _new))
      return await interaction.editReply(this.t('requiredParams', {
        locale,
        params: [
          _journal ? 'journal' : '',
          _new ? 'new' : '',
        ].join(', '),
      }));

    const journal = journals.find(j => j.name === _journal);

    if (!journal)
      return await interaction.editReply(this.t('journal404', { locale }));

    const news = await axios.get(journal.url).then(r => r.data) as any[];

    const __new = news.find(_fnew => _fnew[journal.properties.title].match(_new));

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(__new[journal.properties.title].slice(0, 256))
      .setDescription(__new[journal.properties.description].join('\n\n').slice(0, 4096))];

    await interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const focused = interaction.options.getFocused(true);

    res = await this[`${<'category' | 'journal' | 'language' | 'new'>focused.name}Autocomplete`]?.(interaction);

    await interaction.respond(res);
  }

  async categoryAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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

      if (i === 24) break;
    }

    return res;
  }

  async journalAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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
      ];

      res.push({
        name: `${name.join('').slice(0, 100)}`,
        value: `${_journal.name}`,
      });

      if (i === 24) break;
    }

    return res;
  }

  async languageAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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

      if (i === 24) break;
    }

    return res;
  }

  async newAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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