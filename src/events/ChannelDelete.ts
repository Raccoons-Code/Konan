import { NonThreadGuildBasedChannel } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class ChannelDelete extends Event<'channelDelete'> {
  constructor() {
    super({
      name: 'channelDelete',
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    appStats.fetch({ filter: 'channels' });

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