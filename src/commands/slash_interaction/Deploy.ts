import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import Commands from '..';
import { Client, SlashCommand } from '../../structures';

const { env } = process;
const { GUILD_ID, OWNER_ID } = env;

export default class extends SlashCommand {
  constructor(client: Client) {
    super(client);

    this.data = new SlashCommandBuilder().setName('deploy')
      .setDescription('Deploy commands (Restricted for bot\'owners).')
      .setDefaultPermission(false)
      .addStringOption(option => option.setName('type')
        .setDescription('Type of deploy')
        .setChoices([['Global', 'global'], ['Guild', 'guild']])
        .setRequired(true))
      .addBooleanOption(option => option.setName('reset')
        .setDescription('Reset all commands.'));
  }

  async execute(interaction: CommandInteraction) {
    const { client, locale, options, user } = interaction;

    const guilds = GUILD_ID?.split(',');
    const owners = OWNER_ID?.split(',');

    if (!owners?.includes(user.id)) return;

    await interaction.deferReply({ ephemeral: true });

    const type = options.getString('type');
    const reset = options.getBoolean('reset');

    const data = [];
    const data_private: any[] = [];
    const commands: SlashCommand[] = [];
    const { applicationCommandTypes } = Commands;
    const applicationCommands = await Commands.loadCommands(applicationCommandTypes);

    Object.values(applicationCommands).forEach(_commands =>
      commands.push(..._commands.toJSON() as SlashCommand[]));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      const command_data = command.data.toJSON();

      if (command_data.default_permission === false) {
        command_data.default_permission = true;

        data_private.push(command_data);

        continue;
      }

      reset || data.push(command_data);
    }

    try {
      if (type === 'global')
        await client.application?.commands.set(data);

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        const guild = await client.guilds.fetch(id);

        if (!guild) continue;

        if (type === 'global') {
          const guild_commands = await guild.commands.fetch();

          const guild_commands_data = guild_commands.filter(guild_command =>
            !data_private.some(command => command.name === guild_command.name))
            .toJSON().reduce((acc, command) => [...acc, {
              name: command.name,
              defaultPermission: command.defaultPermission,
              description: command.description,
              options: command.options,
              type: command.type,
            }], [] as any[]);

          guild_commands_data.push(...data_private);

          await guild.commands.set(guild_commands_data);

          continue;
        }

        await guild.commands.set([...data, ...data_private]);
      }

      await interaction.editReply(`${this.t(['reloadedAppCommands', 'type'], { locale })} ${type}`);

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);

      await interaction.editReply(`${this.t(['reloadAppCommandsError', 'type'], { locale })} ${type}`);
    }
  }
}