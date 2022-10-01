import { Guild } from 'discord.js';
import { appStats, logger } from '../client';
import { Event } from '../structures';

export default class GuildCreate extends Event<'guildCreate'> {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildCreate',
    });
  }

  async execute(guild: Guild) {
    logger.newGuild(guild);
    appStats.fetch();
  }
}