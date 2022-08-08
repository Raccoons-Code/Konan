import { Message } from 'discord.js';
import { Command } from '../../structures';

export default class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Replies with Pong!',
    });
  }

  async execute(message: Message) {
    const sent = await message.reply('Pong!');

    const ping = sent.createdTimestamp - (message.editedTimestamp ?? message.createdTimestamp);

    return sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);
  }
}