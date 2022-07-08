import { Client } from 'discord.js';
import { env } from 'node:process';
import commandHandler from '../commands';
import { SlashCommand } from '../structures';

export default class Deploy {
  client!: Client;

  constructor(client?: Client) {
    Object.defineProperties(this, {
      client: { value: client },
    });
  }

  async online(client: Client = this.client) {
    const dataPrivate: any[] = [];
    const commands: SlashCommand[] = [];
    const { applicationCommandTypes } = commandHandler;
    const applicationCommands = await commandHandler.loadCommands(applicationCommandTypes);

    const guilds = env.DISCORD_TEST_GUILD_ID?.split(',') ?? [];

    Object.values(applicationCommands).forEach(_commands =>
      commands.push(...<SlashCommand[]>_commands.toJSON()));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      const commandData = command.data.toJSON();

      if (command.props?.ownerOnly)
        dataPrivate.push(commandData);
    }

    try {
      for (let i = 0; i < guilds.length; i++) {
        const id = guilds[i];

        const guild = await client.guilds.fetch(id);

        if (!guild) continue;

        await guild.commands.set(dataPrivate);
      }
    } catch {
      console.error('Failed to deploy commands');
    }
  }
}