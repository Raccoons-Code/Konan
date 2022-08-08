import { Message } from 'discord.js';
import { Event } from '../structures';

export default class MessageDelete extends Event {
  constructor() {
    super({
      name: 'messageDelete',
    });
  }

  async execute(message: Message) {
    Promise.all([
      this.prisma.wordleInstance.deleteMany({
        where: {
          messageId: message.id,
        },
      }),
    ]);
  }
}