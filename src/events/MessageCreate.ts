import { Message } from 'discord.js';
import { Client, Command, Event } from '../structures';

export default class MessageCreate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
      name: 'messageCreate',
      partials: ['MESSAGE'],
    });
  }

  async execute(message: Message & { [k: string]: any, args: string[] }) {
    const { author, channel, client, content, guild } = message;

    if (author.bot) return;

    const { commands, user } = <Client>client;
    const botRole = guild?.me?.roles.botRole ?? user;
    const pattern = RegExp(`^\\s*<@!?&?(?:${user?.id}|${botRole?.id})>([\\w\\W]*)$`);
    const matched = content.match(pattern);

    if (!matched) return;

    message.args = matched[1].trim().split(/\s+/g);

    const commandName = message.commandName = message.args.shift() || 'help';

    const command = <Command>commands.message_command?.get(commandName);

    if (!command) return;

    if (!/(backup|deploy|throw)/.test(commandName))
      await channel.sendTyping();

    try {
      await command.execute(message);
    } catch (error: any) {
      this.client.sendError(error);
    }
  }
}