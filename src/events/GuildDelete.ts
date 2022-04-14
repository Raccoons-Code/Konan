import { Guild } from 'discord.js';
import { Client, Event } from '../structures';

export default class GuildDelete extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    guild.client.fetchStats();
  }
}