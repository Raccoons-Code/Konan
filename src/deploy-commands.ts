import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import 'dotenv/config';
import { env } from 'node:process';
import Commands from './commands';
import { SlashCommand } from './structures';

const { DISCORD_APPLICATION_ID, DISCORD_TOKEN, DISCORD_TEST_GUILD_ID } = env;

const GLOBAL = false;
const reset = false;

if (!(DISCORD_APPLICATION_ID && DISCORD_TOKEN))
  throw Error(`Missing required params:${DISCORD_APPLICATION_ID ? '' : ' DISCORD_APPLICATION_ID'}${DISCORD_TOKEN ? '' : ' DISCORD_TOKEN'}`);

const guilds = DISCORD_TEST_GUILD_ID?.split(',') ?? [];

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

    if (command.props?.ownerOnly) {
      data_private.push(command_data);

      continue;
    }

    command_data.default_permission = true;

    reset || data.push(command_data);
  }

  try {
    console.log('Started refreshing application (/) commands.');

    if (GLOBAL) {
      await rest.put(Routes.applicationCommands(DISCORD_APPLICATION_ID), { body: data });

      for (let i = 0; i < guilds.length; i++) {
        const id = guilds[i];

        const guildCommands = await rest.get(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, id)) as any[];

        const guild_commands_data = guildCommands.filter(guildCommand =>
          !data_private.some(command => command.name === guildCommand.name))
          .reduce((acc, command) => acc.concat({ ...command }), <any[]>[]);

        guild_commands_data.push(...data_private);

        await rest.put(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, id), { body: guildCommands });
      }

      console.log('Successfully reloaded application (/) commands.');
    } else {
      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        await rest.put(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, id), { body: [...data, ...data_private] });

        console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();