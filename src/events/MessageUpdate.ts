import { Message } from 'discord.js';
import { Event } from '../structures';

export default class MessageUpdate extends Event<'messageUpdate'> {
  constructor() {
    super({
      name: 'messageUpdate',
    });
  }

  async execute(oldMessage: Message, newMessage: Message) {
    oldMessage.client.emit('messageCreate', newMessage);
  }
}