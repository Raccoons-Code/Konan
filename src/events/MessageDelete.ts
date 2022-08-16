import { Message } from 'discord.js';
import { Event } from '../structures';

export default class MessageDelete extends Event<'messageDelete'> {
  constructor() {
    super({
      name: 'messageDelete',
    });
  }

  async execute(message: Message) {
    Promise.all([
      this.prisma.wordleInstance.updateMany({
        where: {
          messageId: message.id,
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