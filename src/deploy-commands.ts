import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import 'dotenv/config';
import Commands from './commands';
import { SlashCommand } from './structures';

const { env } = process;
const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = env;

const GLOBAL = false;
const reset = false;

if (!CLIENT_ID || !DISCORD_TOKEN)
  throw Error(`Missing required params:${CLIENT_ID ? '' : ' CLIENT_ID'}${DISCORD_TOKEN ? '' : ' DISCORD_TOKEN'}`);

const guilds = GUILD_ID?.split(',') ?? [];

const data = [];
const data_private: any[] = [];
const commands: SlashCommand[] = [];
const { applicationCommandTypes } = Commands;

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  const applicationCommands = await Commands.loadCommands(applicationCommandTypes);

  Object.values(applicationCommands).forEach(_commands =>
    commands.push(...<SlashCommand[]>_commands.toJSON()));

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
    console.log('Started refreshing application (/) commands.');

    if (GLOBAL) {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: data });

      for (let i = 0; i < guilds.length; i++) {
        const id = guilds[i];

        const guild_commands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, id)) as any[];

        const guild_commands_data = guild_commands.filter(guild_command =>
          !data_private.some(command => command.name === guild_command.name))
          .reduce((acc, command) => [...acc, {
            name: command.name,
            defaultPermission: command.defaultPermission,
            description: command.description,
            options: command.options,
            type: command.type,
          }], <any[]>[]);

        guild_commands_data.push(...data_private);

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: guild_commands });
      }

      console.log('Successfully reloaded application (/) commands.');
    } else {
      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: [...data, ...data_private] });

        console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();