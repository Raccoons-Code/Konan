require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { env: { CLIENT_ID, DEPLOY_GLOBAL, DEPLOY_RESET, DISCORD_TOKEN, GUILD_ID } } = process;
const Commands = require('./commands');

const GLOBAL = false || DEPLOY_GLOBAL == 'true';
const reset = true || DEPLOY_RESET == 'true';

const guilds = GUILD_ID?.split(',');

const data = [];
const data_private = [];
const commands = [];
const { applicationCommands } = Commands;

Object.values(applicationCommands).forEach(_commands => commands.push(_commands.toJSON()));

commands.flat().forEach(command => {
  const command_data = command.data.toJSON();

  if (command.data.defaultPermission || typeof command.data.defaultPermission === 'undefined')
    return reset || data.push(command_data);

  command_data.defaultPermission = true;
  command_data.default_permission = true;

  data_private.push(command_data);
});

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
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: [...data_private, ...data] });

        console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
      });
    }
  } catch (error) {
    console.error(error);
  }
})();