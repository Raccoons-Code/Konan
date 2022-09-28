import { Collection, Message, PartialMessage, Snowflake, TextBasedChannel } from 'discord.js';
import { Event } from '../structures';

export default class MessageDeleteBulk extends Event<'messageDeleteBulk'> {
  constructor() {
    super({
      name: 'messageDeleteBulk',
    });
  }

  async execute(messages: Collection<Snowflake, Message | PartialMessage>, channel: TextBasedChannel) {
    channel.client.stats.fetch({ filter: 'channels' });

    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          OR: messages.map(message => ({ messageId: message.id })),
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