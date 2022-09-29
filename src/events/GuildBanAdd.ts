import { GuildBan } from 'discord.js';
import { Event } from '../structures';

export default class GuildBanAdd extends Event<'guildBanAdd'> {
  constructor() {
    super({
      intents: 'GuildBans',
      name: 'guildBanAdd',
    });
  }

  async execute(ban: GuildBan) {
    ban.client.stats.fetch({ filter: 'guilds' });

    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          userId: ban.user.id,
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