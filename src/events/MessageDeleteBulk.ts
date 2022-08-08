import { Collection, Message, PartialMessage, Snowflake, TextBasedChannel } from 'discord.js';
import { Event } from '../structures';

export default class MessageDeleteBulk extends Event {
  constructor() {
    super({
      name: 'messageDeleteBulk',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(messages: Collection<Snowflake, Message | PartialMessage>, channel: TextBasedChannel) {
    Promise.all([
      this.prisma.wordleInstance.deleteMany({
        where: {
          OR: messages.map(message => ({ messageId: message.id })),
        },
      }),
    ]);
  }
}