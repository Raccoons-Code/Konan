import { GuildBan } from 'discord.js';
import { Event } from '../structures';

export default class extends Event<'guildBanAdd'> {
  constructor() {
    super({
      name: 'guildBanAdd',
    });
  }

  async execute(ban: GuildBan) {
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