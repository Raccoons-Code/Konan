import { NonThreadGuildBasedChannel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ChannelDelete extends Event {
  constructor() {
    super({
      name: 'channelDelete',
      partials: [Partials.Channel],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    channel.client.stats.fetch({ filter: 'channels' });

    Promise.all([
      this.prisma.wordleInstance.deleteMany({
        where: {
          channelId: channel.id,
        },
      }),
    ]);
  }
}