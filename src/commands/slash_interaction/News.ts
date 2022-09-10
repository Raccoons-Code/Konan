import axios from 'axios';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { journals } from '../../modules/News';
import { SlashCommand } from '../../structures';

export default class News extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Fun',
    });

    this.data = new SlashCommandBuilder().setName('news')
      .setDescription('Show news from a journal. Use `/news [category | language] <journal> <new>`')
      .setNameLocalizations(this.getLocalizations('newsName'))
      .setDescriptionLocalizations(this.getLocalizations('newsDescription'))
      .addStringOption(option => option.setName('category')
        .setDescription('Category of the journal.')
        .setNameLocalizations(this.getLocalizations('categoryName'))
        .setDescriptionLocalizations(this.getLocalizations('categoryDescription'))
        .setAutocomplete(true))
      .addStringOption(option => option.setName('language')
        .setDescription('Language of the journal.')
        .setNameLocalizations(this.getLocalizations('languageName'))
        .setDescriptionLocalizations(this.getLocalizations('languageDescription'))
        .setAutocomplete(true))
      .addStringOption(option => option.setName('journal')
        .setDescription('Journal to show the news from.')
        .setNameLocalizations(this.getLocalizations('journalName'))
        .setDescriptionLocalizations(this.getLocalizations('journalDescription'))
        .setAutocomplete(true))
      .addStringOption(option => option.setName('new')
        .setDescription('Show the new. Select a journal before.')
        .setNameLocalizations(this.getLocalizations('newName'))
        .setDescriptionLocalizations(this.getLocalizations('newDescription'))
        .setAutocomplete(true));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale, options } = interaction;

    const _journal = options.getString('journal');

    const _new = options.getString('new');

    if (!(_journal && _new))
      return interaction.editReply(this.t('requiredParams', {
        locale,
        params: [
          _journal ? 'journal' : '',
          _new ? 'new' : '',
        ].join(', '),
      }));

    const journal = journals.find(j => j.name === _journal);

    if (!journal)
      return interaction.editReply(this.t('journal404', { locale }));

    const news = await axios.get(journal.url).then(r => r.data) as any[];

    const __new = news.find(_fnew => _fnew[journal.properties.title].match(_new));

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle(__new[journal.properties.title].slice(0, 256))
        .setDescription(__new[journal.properties.description].join('\n\n').slice(0, 4096)),
    ];

    return interaction.editReply({ embeds });
  }
}