import { GuildMember, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberRemove extends Event<'guildMemberRemove'> {
  constructor() {
    super({
      intents: ['GuildMembers'],
      name: 'guildMemberRemove',
      partials: [Partials.GuildMember, Partials.User],
    });
  }

  async execute(member: GuildMember) {
    member.client.stats.fetch({ filter: 'guilds' });

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