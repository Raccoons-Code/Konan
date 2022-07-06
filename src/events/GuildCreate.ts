import { Guild } from 'discord.js';
import { Event } from '../structures';

export default class GuildCreate extends Event {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildCreate',
    });
  }

  async execute(guild: Guild) {
    guild.client.stats.fetch();
  }
}