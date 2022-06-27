import { Client, Guild } from 'discord.js';
import { Event } from '../structures';

export default class GuildDelete extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['Guilds'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    guild.client.fetchStats();
  }
}