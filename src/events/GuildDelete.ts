import { Guild } from 'discord.js';
import { Event } from '../structures';

export default class GuildDelete extends Event {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    guild.client.fetchStats();
  }
}