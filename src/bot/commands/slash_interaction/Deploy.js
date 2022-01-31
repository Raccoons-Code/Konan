const { SlashCommand } = require('../../classes');
const Commands = require('../');
const { env: { GUILD_ID, OWNER_ID } } = process;

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('deploy')
      .setDescription('Deploy commands (Restricted for bot\'owners).')
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('type')
        .setDescription('Type of deploy')
        .setChoices([['Global', 'global'], ['Guild', 'guild']])
        .setRequired(true))
      .addBooleanOption(option => option.setName('reset')
        .setDescription('Reset all commands.'));
  }

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { client, locale, options, user } = interaction;

    const guilds = GUILD_ID?.split(',');
    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    const type = options.getString('type');
    const reset = options.getBoolean('reset');

    const data = [];
    const data_private = [];
    const commands = [];
    const { applicationCommands } = Commands;

    Object.values(applicationCommands).forEach(_commands => commands.push(_commands.toJSON()));

    commands.flat().forEach(command => {
      if (command.data.defaultPermission || typeof command.data.defaultPermission === 'undefined')
        return reset || data.push(command.data.toJSON());

      command.data.setDefaultPermission(true);

      const command_data = command.data.toJSON();

      data_private.push(command_data);
    });

    try {
      if (type === 'global')
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

        await _guild.commands.set([...data, ...data_private]);
      }

      await interaction.editReply({
        content: `${this.t('Successfully reloaded application (/) commands. Type:', { locale })} ${type}`,
        ephemeral: true,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      await interaction.editReply({
        content: `${this.t('Error trying to reload application commands (/). Type:', { locale })} ${type}`,
        ephemeral: true,
      }).catch(() => null);
    }
  }
};