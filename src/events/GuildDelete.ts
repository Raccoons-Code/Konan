import { Guild } from 'discord.js';
import { logger } from '../client';
import { Event } from '../structures';

export default class GuildDelete extends Event {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    logger.oldGuild(guild);
    guild.client.stats.fetch();
  }
}