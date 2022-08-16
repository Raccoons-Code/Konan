import { NonThreadGuildBasedChannel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ChannelDelete extends Event<'channelDelete'> {
  constructor() {
    super({
      name: 'channelDelete',
      partials: [Partials.Channel],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    channel.client.stats.fetch({ filter: 'channels' });

    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          channelId: channel.id,
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