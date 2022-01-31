require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { env: { CLIENT_ID, DEPLOY_GLOBAL, DEPLOY_RESET, DISCORD_TOKEN, GUILD_ID } } = process;
const Commands = require('./commands');

const GLOBAL = false || DEPLOY_GLOBAL == 'true';
const reset = false || DEPLOY_RESET == 'true';

const guilds = GUILD_ID?.split(',');

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

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (GLOBAL) {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: data });

      for (let i = 0; i < guilds?.length; i++) {
        const id = guilds[i];

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: data_private });
      }

      console.log('Successfully reloaded application (/) commands.');
    } else {
      guilds?.forEach(async id => {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: [...data, ...data_private] });

        console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
      });
    }
  } catch (error) {
    console.error(error);
  }
})();