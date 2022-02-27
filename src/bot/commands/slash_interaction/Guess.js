const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../structures');
const db = require('quick.db');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('guess')
      .setDescription('You have 10 chances to guess the number from 1 to 100 that the bot set.')
      .addIntegerOption(option => option.setName('number')
        .setDescription('Integer')
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

    const number = options.getInteger('number');

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(this.t('guessNumber', { locale }))];

    if (!db.has(`${guildId}.${author.id}.guess`))
      db.set(`${guildId}.${author.id}.guess`, { value: this.util.mathRandom(100, 1) });

    const { value, user = [] } = db.get(`${guildId}.${author.id}.guess`);

    if (number === value) {
      embeds[0]
        .setDescription(this.t('numberCorrect', { locale, author, number }))
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

      db.delete(`${guildId}.${author.id}.guess`);

      return await interaction.editReply({ embeds });
    }

    if (this.util.isDuplicate(user, number)) {
      if (number < value)
        embeds[0]
          .setDescription(this.t('numberRepeatSmaller', { locale, author, number }));

      if (number > value)
        embeds[0]
          .setDescription(this.t('numberRepeatGreater', { locale, author, number }));

      embeds[0].addFields({
        name: `${this.t('previousGuesses', { locale })} ${user?.length}/10`,
        value: `${user?.join(' ') || '-'}`,
      });

      return await interaction.editReply({ embeds });
    }

    if (user?.length === 9) {
      embeds[0]
        .setDescription(this.t('numberGameover', { locale, author, number }))
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user.length + 1}/10`,
          value: `${user.join(' ')}`,
        });

      db.delete(`${guildId}.${author.id}.guess`);

      return await interaction.editReply({ embeds });
    }

    if (number < value)
      embeds[0]
        .setDescription(`${this.t('numberSmaller', { locale, author, number })} :arrow_down_small:`)
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

    if (number > value)
      embeds[0]
        .setDescription(`${this.t('numberGreater', { locale, author, number })} :arrow_up_small:`)
        .addFields({
          name: `${this.t('previousGuesses', { locale })} ${user?.length + 1}/10`,
          value: `${user?.join(' ') || '-'}`,
        });

    user.push(number);

    db.set(`${guildId}.${author.id}.guess.user`, user);

    interaction.editReply({ embeds });
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { guildId, options, user } = interaction;

    const value = options.getFocused();
    const regex = RegExp(value);

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

  await interaction.respond(res);
  }
};