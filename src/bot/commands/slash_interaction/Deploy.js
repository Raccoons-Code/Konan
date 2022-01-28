const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const Commands = require('../');
const { env: { GUILD_ID, OWNER_ID } } = process;

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
    this.data = this.setName('deploy')
      .setDescription('Deploy commands (Restricted for bot\'owners).')
      .setDefaultPermission(true)
      .addStringOption(option => option.setName('type')
        .setDescription('Type of deploy')
        .setChoices([['Global', 'global'], ['Guild', 'guild']])
        .setRequired(true))
      .addBooleanOption(option => option.setName('reset')
        .setDescription('Reset all commands.'));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    const { client, locale, options, user } = interaction;

    const guilds = GUILD_ID?.split(',');
    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    const type = options.getString('type');
    const reset = options.getString('reset');

    const data = [];
    const data_private = [];
    const commands = [];
    const { applicationCommands } = Commands;

    if (!reset) {
      Object.values(applicationCommands).forEach(_commands => commands.push(_commands.toJSON()));

      commands.flat().forEach(command => {
        if (command.data.defaultPermission || typeof command.data.defaultPermission === 'undefined')
          return data.push(command.data.toJSON());

        const command_data = command.data.toJSON();

        command_data.defaultPermission = true;

        data_private.push(command_data);
      });
    }

    try {
      await client.application.commands.set(data);

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        const _guild = client.guilds.resolve(id) ||
          client.guilds.cache.get(id) ||
          await client.guilds.fetch(id);

        if (!_guild) continue;

        if (type === 'global') {
          await _guild.commands.set(data_private);
          continue;
        }
        await _guild.commands.set(data);
      }

      await interaction.reply({
        content: `${this.t('Successfully reloaded application (/) commands. Type:', { locale })} ${type}`,
        ephemeral: true,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: `${this.t('Error trying to reload application commands (/). Type:', { locale })} ${type}`,
        ephemeral: true,
      }).catch(() => null);
    }
  }
};