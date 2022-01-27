require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { env: { CLIENT_ID, GUILD_ID, DEPLOY_GLOBAL, DEPLOY_RESET, DISCORD_TOKEN } } = process;
const Commands = require('./commands');

const GLOBAL = DEPLOY_GLOBAL == 'true';
const reset = DEPLOY_RESET == 'true';

const commands = [];
const data = [];

const { applicationCommands } = Commands;

if (!reset) {
  Object.values(applicationCommands).forEach(e => commands.push(e.toJSON()));

  commands.flat().forEach(e => data.push(e.data.toJSON()));
}

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (GLOBAL) {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: data });
      console.log('Successfully reloaded application (/) commands.');
    } else {
      GUILD_ID?.split(',').forEach(async id => {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), { body: data });
        console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
      });
    }
  } catch (error) {
    console.error(error);
  }
})();