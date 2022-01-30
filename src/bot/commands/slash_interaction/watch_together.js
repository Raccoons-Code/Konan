const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, CommandInteraction, Message } = require('discord.js');
const { Client } = require('../../classes');
const { DiscordTogether } = require('discord-together');

module.exports = class extends SlashCommandBuilder {
  /** @param {Client} client */
  constructor(client) {
    super();
    this.discordTogether = new DiscordTogether(client);
    this.applications = Object.keys(this.discordTogether.applications);
    client.DiscordTogether = this.discordTogether;
    this.client = client;
    this.t = client.t;
    this.util = client.util;
    this.data = this.setName('party')
      .setDescription('Create an activity party together')
      .addStringOption(option => option.setName('activity')
        .setDescription('Select activity')
        .setAutocomplete(true)
        .setRequired(true));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    const { channel, locale, member, options } = interaction;

    await channel.sendTyping();

    if (!member.voice.channel)
      return interaction.reply({
        content: `${member}, ${this.t('you must be on a voice channel.', { locale })}`,
        ephemeral: true,
      });

    this.discordTogether.createTogetherCode(member.voice.channel.id, options.getString('activity'))
      .then(async invite => this.timeout_erase(await interaction.reply({
        content: `${invite.code}`,
        fetchReply: true,
      }), 60)).catch(error => {
        console.log(error);
        if (error.name === 'SyntaxError')
          return interaction.reply({
            content: this.t('This activity does not exist.', { locale }),
            ephemeral: true,
          });
        interaction.reply({
          content: this.t('There was an error while executing this command!', { locale }),
          ephemeral: true,
        });
      });
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const pattern = options.getString('activity');

    const regex = RegExp(`${pattern}`, 'i');

    const applications = pattern ?
      this.applications.filter(app => regex.test(app) || regex.test(this.t(app, { locale }))) :
      this.applications;

    const res = this.setChoices(applications, { locale, capitalize: true });

    interaction.respond(res);
  }

  setChoices(applications = this.applications, options = { locale: 'en', capitalize: false }, array = []) {
    const { locale, capitalize } = options;

    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];

      if (!/(dev$)/i.test(application))
        array.push({
          name: `${this.t(application, { locale, capitalize })}`,
          value: `${application}`,
        });

      if (i === 24) break;
    }

    return array;
  }

  /**
   * @description delete one interaction with async timeout delay
   * @param {Message} message
   * @param {Seconds<Number>} timeout
   * @async
   */
  async timeout_erase(message, timeout = 0) {
    if (!message) return console.error('Unable to delete undefined interaction.');
    await this.util.waitAsync(timeout * 1000);
    return await message.delete().catch(() => null);
  }
};