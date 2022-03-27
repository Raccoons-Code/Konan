import { Guild } from 'discord.js';
import { Client, Event } from '../structures';

export default class GuildCreate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS'],
      name: 'guildCreate',
    });
  }

  async execute(guild: Guild) {
    this.client.fetchStats();
  }
}