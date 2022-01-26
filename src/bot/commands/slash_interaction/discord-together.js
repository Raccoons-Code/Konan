const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { DiscordTogether } = require('discord-together');

function setChoices(discord_together) {
  const choices = [];

  Object.keys(discord_together.applications)
    .forEach(application => choices.push([application, application]));

  return choices;
}

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.discord_together = new DiscordTogether(client);
    client.discord_together = this.discord_together;
    this.client = client;
    this.data = this.setName('party')
      .setDescription('Create a application together party')
      .addStringOption(option => option.setName('application')
        .setDescription('Select application')
        .setChoices(setChoices(this.discord_together))
        .setRequired(true));
    this.t = client.t;
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    const { locale, member, options } = interaction;

    if (!member.voice.channel)
      return interaction.reply({
        content: `${member}, ${this.t('you must be on a voice channel', { locale })}.`,
        ephemeral: true,
      });

    this.discord_together.createTogetherCode(member.voice.channel.id, options.getString('application'))
      .then(invite => interaction.reply(`${invite.code}`));
  }
};