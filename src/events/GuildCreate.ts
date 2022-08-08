import { Guild } from 'discord.js';
import { logger } from '../client';
import { Event } from '../structures';

export default class GuildCreate extends Event {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildCreate',
    });
  }

  async execute(guild: Guild) {
    logger.newGuild(guild);
    guild.client.stats.fetch();
  }
}