const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../classes');
const db = require('quick.db');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('guess')
      .setDescription('You have 10 chances to guess the number from 1 to 100 that the bot set.')
      .addNumberOption(option => option.setName('number')
        .setDescription('Number')
        .setMinValue(1)
        .setMaxValue(100)
        .setAutocomplete(true)
        .setRequired(true));
  }

  async execute(interaction = this.CommandInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    await interaction.deferReply({ ephemeral: true });

    const { guildId, locale, options, user: author } = interaction;

    const number = options.getNumber('number');

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(this.t('Guess the number.', { locale }))];

    if (!db.has(`${guildId}.${author.id}.guess`))
      db.set(`${guildId}.${author.id}.guess`, { value: this.util.mathRandom(100, 1) });

    const { value, user = [] } = db.get(`${guildId}.${author.id}.guess`);

    if (number === value) {
      embeds[0]
        .setDescription(this.t('{{author}}, {{number}} is correct, congratulations!', { locale, author, number }))
        .addFields({
          name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

      db.delete(`${guildId}.${author.id}.guess`);

      return await interaction.editReply({ embeds });
    }

    if (this.util.isDuplicate(user, number)) {
      if (number < value)
        embeds[0]
          .setDescription(this.t('{{author}}, you have already tried {{number}}!\n:arrow_down_small: This is minor!', { locale, author, number }));

      if (number > value)
        embeds[0]
          .setDescription(this.t('{{author}}, you have already tried {{number}}!\n:arrow_up_small: This is greater!', { locale, author, number }));

      embeds[0].addFields({
        name: `${this.t('Previous guesses', { locale })} ${user?.length}/10`,
        value: `${user?.join(' ') || '-'}`,
      });

      return interaction.editReply({ embeds });
    }

    if (user?.length === 9) {
      embeds[0]
        .setDescription(this.t('{{author}}, {{number}} is incorrect, game over!', { locale, author, number }))
        .addFields({
          name: `${this.t('Previous guesses', { locale })} ${user.length + 1}/10`,
          value: `${user.join(' ')}`,
        });

      db.delete(`${guildId}.${author.id}.guess`);

      return interaction.editReply({ embeds });
    }

    if (number < value)
      embeds[0]
        .setDescription(`${this.t('{{author}}, {{number}} is minor!', { locale, author, number })} :arrow_down_small:`)
        .addFields({
          name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

    if (number > value)
      embeds[0]
        .setDescription(`${this.t('{{author}}, {{number}} is greater!', { locale, author, number })} :arrow_up_small:`)
        .addFields({
          name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

    user.push(number);

    db.set(`${guildId}.${author.id}.guess.user`, user);

    interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { guildId, options, user } = interaction;

    const value = options.getFocused();
    const regex = RegExp(value);

    const res = [];

    const guess = db.get(`${guildId}.${user.id}.guess`);

    for (let i = 1; i < 101; i++) {
      if (guess?.user?.includes(i)) continue;

      if (regex.test(i))
        res.push({
          name: i,
          value: i,
        });

      if (res.length === 25) break;
    }

    interaction.respond(res);
  }
};