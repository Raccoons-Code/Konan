const { SlashCommand } = require('../../structures');
const Commands = require('..');
const { env: { GUILD_ID, OWNER_ID } } = process;

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
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
    const { client, locale, options, user } = interaction;

    const guilds = GUILD_ID?.split(',');
    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.deferReply({ ephemeral: true });

    const type = options.getString('type');
    const reset = options.getBoolean('reset');

    const data = [];
    const data_private = [];
    const commands = [];
    const { applicationCommands } = Commands;

    Object.values(applicationCommands).forEach(_commands => commands.push(..._commands.toJSON()));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      if (command.data.defaultPermission === false) {
        command.data.setDefaultPermission(true);

        const command_data = command.data.toJSON();

        data_private.push(command_data);

        continue;
      }

      reset || data.push(command.data.toJSON());
    }

    try {
      if (type === 'global')
        await client.application.commands.set(data);

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        const _guild = await client.guilds.fetch(id);

        if (!_guild) continue;

        if (type === 'global') {
          await _guild.commands.set(data_private);
          continue;
        }

        await _guild.commands.set([...data, ...data_private]);
      }

      await interaction.editReply({
        content: `${this.t(['reloadedAppCommands', 'type'], { locale })} ${type}`,
        ephemeral: true,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      await interaction.editReply({
        content: `${this.t(['reloadAppCommandsError', 'type'], { locale })} ${type}`,
        ephemeral: true,
      }).catch(() => null);
    }
  }
};