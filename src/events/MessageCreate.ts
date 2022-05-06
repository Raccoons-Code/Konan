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

  async execute(message: Message) {
    const { author, channel, client, content, guild } = message;

    if (author.bot) return;

    const { commands, user } = client;
    const botRole = guild?.me?.roles.botRole ?? user;
    const pattern = RegExp(`^\\s*<@!?&?(?:${user?.id}|${botRole?.id})>([\\w\\W]*)$`);
    const matched = content.match(pattern);

    if (!matched) return;

    message.text = matched[1].trim();

    message.args = message.text.split(/\s+/g);

    const matchedComponentLink = matched[1].match(this.pattern.componentCommandNameLink) ?? [];

    const commandName = message.commandName = matchedComponentLink[3] || message.args.shift() || 'help';

    const command = <Command>commands.message_command?.get(commandName);

    if (!command) return;

    if (!/(button|deploy|https?|throw)/.test(commandName))
      await channel.sendTyping();

    try {
      await command.execute(message);
    } catch (error: any) {
      client.sendError(error);
    }
  }
}