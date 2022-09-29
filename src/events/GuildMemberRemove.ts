import { GuildMember } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberRemove extends Event<'guildMemberRemove'> {
  constructor() {
    super({
      name: 'guildMemberRemove',
    });
  }

  async execute(member: GuildMember) {
    member.client.stats.fetch({ filter: 'users' });

    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          userId: member.id,
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