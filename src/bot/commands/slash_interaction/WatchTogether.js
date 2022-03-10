const { SlashCommand } = require('../../structures');
const { DiscordTogether } = require('discord-together');
const { Constants } = require('discord.js');
const { ChannelTypes } = Constants;
const { GUILD_VOICE } = ChannelTypes;

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client, {
      clientPermissions: ['CREATE_INSTANT_INVITE'],
    });
    this.data = this.setName('party')
      .setDescription('Create an activity party together.')
      .addStringOption(option => option.setName('activity')
        .setDescription('Select activity.')
        .setAutocomplete(true)
        .setRequired(true))
      .addChannelOption(option => option.setName('channel')
        .setDescription('Select a voice channel.')
        .addChannelTypes([GUILD_VOICE]));
    if (client?.ready) {
      this.discordTogether = new DiscordTogether(client);
      this.applications = Object.keys(this.discordTogether.applications);
      this.client.discordTogether = this.discordTogether;
    }
  }

  async execute(interaction = this.CommandInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    const { client, locale, member, options } = interaction;

    const channel = options.getChannel('channel') || member.voice.channel;

    if (!channel || channel.type !== 'GUILD_VOICE')
      return await interaction.reply({
        content: `${member}, ${this.t('userMustBeOnVoiceChannel', { locale })}`,
        ephemeral: true,
      });

    const clientPermissions = channel.permissionsFor(client.user.id).missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return await interaction.reply({
        content: `${member}, ${this.t('missingChannelPermission', { locale, PERMISSIONS: clientPermissions })}`,
        ephemeral: true,
      });

    const activity = options.getString('activity').toLowerCase();

    try {
      const invite = await this.discordTogether.createTogetherCode(channel.id, activity);

      await this.timeout_erase(await interaction.reply({ content: `${invite.code}`, fetchReply: true }), 60);
    } catch (error) {
      if (error.name === 'SyntaxError')
        return await interaction.reply({ content: this.t('activity404', { locale }), ephemeral: true });

      this.client.sendError(error);

      await interaction.reply({
        content: this.t('There was an error while executing this command!', { locale }),
        ephemeral: true,
      });
    }
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const pattern = options.getString('activity');

    const regex = RegExp(`${pattern}`, 'i');

    const applications = pattern ?
      this.applications.filter(app => regex.test(app) || regex.test(this.t(app, { locale }))) :
      this.applications;

    const res = this.setChoices(applications, { locale });

    await interaction.respond(res);
  }

  setChoices(applications = this.applications, options = { locale: 'en', capitalize: false }, array = []) {
    const { locale, capitalize } = options;

    applications = applications.filter(app => !/(awkword|doodlecrew|lettertile|puttparty|dev$)/i.test(app));

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
