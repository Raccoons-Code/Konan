import { Guild } from 'discord.js';
import { logger } from '../client';
import { Event } from '../structures';

export default class GuildDelete extends Event<'guildDelete'> {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    logger.oldGuild(guild);
    guild.client.stats.fetch();

    Promise.all([
      this.prisma.wordleInstance.deleteMany({
        where: {
          guildId: guild.id,
        },
      }),
    ]);
  }
}