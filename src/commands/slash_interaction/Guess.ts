import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';
import type { GuessGameData } from '../../@types';
import { SlashCommand } from '../../structures';

const quickDb = new QuickDB();

export default class Guess extends SlashCommand {
  constructor() {
    super({
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

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { guildId, locale, options, user: author } = interaction;

    const number = options.getInteger('number', true);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
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

      return interaction.editReply({ embeds });
    }

    if (this.Util.isDuplicate(user, number)) {
      if (number < value)
        embeds[0]
          .setDescription(this.t('numberRepeatSmaller', { locale, author, number }));

      if (number > value)
        embeds[0]
          .setDescription(this.t('numberRepeatGreater', { locale, author, number }));

      embeds[0]
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length}/10`,
          value: `${user?.join(' ').trim() || '-'}`,
        });

      return interaction.editReply({ embeds });
    }

    if (user?.length === 9) {
      embeds[0]
        .setDescription(this.t('numberGameOver', { locale, author, number }))
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user.length + 1}/10`,
          value: `${user.join(' ').trim()}`,
        });

      await quickDb.delete(`${guildId}.${author.id}.guess`);

      return interaction.editReply({ embeds });
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

    return interaction.editReply({ embeds });
  }
}