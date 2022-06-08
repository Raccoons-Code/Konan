import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { QuickDB } from 'quick.db';
import { GuessGameData } from '../../@types';
import { SlashCommand } from '../../structures';

const quickDb = new QuickDB();

export default class Guess extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('guess')
      .setDescription('You have 10 chances to guess the number from 1 to 100 that the bot set.')
      .setNameLocalizations(this.getLocalizations('guessName'))
      .setDescriptionLocalizations(this.getLocalizations('guessDescription'))
      .addIntegerOption(option => option.setName('number')
        .setDescription('Guess a number.')
        .setNameLocalizations(this.getLocalizations('guessNumberName'))
        .setDescriptionLocalizations(this.getLocalizations('guessNumberDescription'))
        .setMinValue(1)
        .setMaxValue(100)
        .setAutocomplete(true)
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { guildId, locale, options, user: author } = interaction;

    const number = options.getInteger('number', true);

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(this.t('guessNumber', { locale })),
    ];

    if (!await quickDb.has(`${guildId}.${author.id}.guess`))
      await quickDb.set(`${guildId}.${author.id}.guess`, { value: this.Util.mathRandom(100, 1) });

    const { value, user = [] } = (await quickDb.get<GuessGameData>(`${guildId}.${author.id}.guess`))!;

    if (number === value) {
      embeds[0]
        .setDescription(this.t('numberCorrect', { locale, author, number }))
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ').trim() || '-'}`,
        });

      await quickDb.delete(`${guildId}.${author.id}.guess`);

      return await interaction.editReply({ embeds });
    }

    if (this.Util.isDuplicate(user, number)) {
      if (number < value)
        embeds[0]
          .setDescription(this.t('numberRepeatSmaller', { locale, author, number }));

      if (number > value)
        embeds[0]
          .setDescription(this.t('numberRepeatGreater', { locale, author, number }));

      embeds[0].addFields({
        name: `${this.t('previousGuesses', { locale })} ${user?.length}/10`,
        value: `${user?.join(' ').trim() || '-'}`,
      });

      return await interaction.editReply({ embeds });
    }

    if (user?.length === 9) {
      embeds[0]
        .setDescription(this.t('numberGameOver', { locale, author, number }))
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user.length + 1}/10`,
          value: `${user.join(' ').trim()}`,
        });

      await quickDb.delete(`${guildId}.${author.id}.guess`);

      return await interaction.editReply({ embeds });
    }

    if (number < value)
      embeds[0]
        .setDescription(`${this.t('numberSmaller', { locale, author, number })} :arrow_down_small:`)
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ').trim() || '-'}`,
        });

    if (number > value)
      embeds[0]
        .setDescription(`${this.t('numberGreater', { locale, author, number })} :arrow_up_small:`)
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ').trim() || '-'}`,
        });

    user.push(number);

    await quickDb.set(`${guildId}.${author.id}.guess.user`, user);

    await interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { guildId, options, user } = interaction;

    const value = options.getFocused();
    const pattern = RegExp(`${value}`);

    const guess = await quickDb.get<GuessGameData>(`${guildId}.${user.id}.guess`);

    for (let i = 1; i < 101; i++) {
      if (guess?.user?.includes(i)) continue;

      if (pattern.test(`${i}`))
        res.push({
          name: `${i}`,
          value: i,
        });

      if (res.length === 25) break;
    }

    await interaction.respond(res);
  }
}