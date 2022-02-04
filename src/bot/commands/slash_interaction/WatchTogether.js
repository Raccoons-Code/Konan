const { SlashCommand } = require('../../classes');
const { DiscordTogether } = require('discord-together');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('party')
      .setDescription('Create an activity party together')
      .addStringOption(option => option.setName('activity')
        .setDescription('Select activity')
        .setAutocomplete(true)
        .setRequired(true));
    if (this.client?.ready) {
      this.discordTogether = new DiscordTogether(this.client);
      this.applications = Object.keys(this.discordTogether.applications);
      this.client.discordTogether = this.discordTogether;
    }
  }

  async execute(interaction = this.CommandInteraction) {
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
        if (error.name === 'SyntaxError')
          return interaction.reply({
            content: this.t('This activity does not exist.', { locale }),
            ephemeral: true,
          });
        this.client.sendError(error);
        interaction.reply({
          content: this.t('There was an error while executing this command!', { locale }),
          ephemeral: true,
        });
      });
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction) {
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

    applications = applications.filter(app => !/(puttparty|dev$)/i.test(app));

    for (let i = 0; i < applications.length; i++) {
      const application = applications[i];

      array.push({
        name: `${this.t(application, { locale, capitalize })}`,
        value: `${application}`,
      });

      if (i === 24) break;
    }

    return array;
  }
};