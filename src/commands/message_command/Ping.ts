import { Message } from 'discord.js';
import { Client, Command } from '../../structures';

export default class Ping extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'ping',
      description: 'Replies with Pong!',
    });
  }

  async execute(message: Message) {
    const sent = await message.reply('Pong!');

    const ping = sent.createdTimestamp - message.createdTimestamp;

    await sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);

    console.log(`Ping: ${ping}ms`);
  }
}