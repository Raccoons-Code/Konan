import { codeBlock, SlashCommandBuilder } from '@discordjs/builders';
import translate, { languages } from '@vitalets/google-translate-api';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const Choices = Object.keys(languages).filter(l => !/(isSupported|getCode)/.test(l))
  .map((l) => [languages[l as 'auto'], l]) as [string, string][];

export default class Translate extends SlashCommand {
  cache: Map<string, string> = new Map();

  constructor(client: Client) {
    super(client);

    this.data = new SlashCommandBuilder().setName('translate')
      .setDescription('Translate text from one language to another. - Powered by Google Translate Api.')
      .addStringOption(option => option.setName('from')
        .setDescription('The language to translate from.')
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('to')
        .setDescription('The language to translate to.')
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('text')
        .setDescription('The text to translate.')
        .setAutocomplete(true)
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    if (interaction.isAutocomplete())
      return await this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const from = options.getString('from', true);
    const to = options.getString('to', true) as 'auto';
    const text = options.getString('text', true);

    const cache = this.util.isJSON(text) ? this.cache.get(text) : text;

    const translation = await translate(cache ?? text, { from, to });

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(`${codeBlock(translation.text).match(this.pattern.content)?.[0]}`)
      .setTitle(`Translation from ${languages[translation.from.language.iso as 'auto']} to ${languages[to]}.`)];

    await interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const { options } = interaction;

    const focused = options.getFocused(true);

    res = await this[`${focused.name as 'from'}Autocomplete`]?.(interaction);

    await interaction.respond(res);
  }

  async fromAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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

  async toAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
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

  async textAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    const { options, user } = interaction;

    const from = options.getString('from', true);
    const to = options.getString('to', true);
    const focused = options.getFocused(true);

    if (!focused.value) return res;

    const varJson = JSON.stringify({ from, to, userId: user.id });

    this.cache.set(varJson, `${focused.value}`);

    const translation = await translate(`${focused.value}`, { from, to });

    const nameProps = [
      translation.text,
      ' (', translation.from.language.iso.toUpperCase(), ' -> ', to.toUpperCase(), ')',
    ];

    res.push({
      name: `${nameProps.join('').match(this.pattern.label)?.[0]}`,
      value: varJson,
    });

    return res;
  }
}