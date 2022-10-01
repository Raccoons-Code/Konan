import { Guild } from 'discord.js';
import { appStats, logger } from '../client';
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
    appStats.fetch();

    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          guildId: guild.id,
          endedAt: {
            isSet: false,
          },
        },
        data: {
          endedAt: new Date(),
        },
      }),
    ]);
  }
}