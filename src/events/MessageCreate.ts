import { Message, Partials } from 'discord.js';
import { Command, Event } from '../structures';

export default class MessageCreate extends Event {
  constructor() {
    super({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
      name: 'messageCreate',
      partials: [Partials.Message],
    });
  }

  async execute(message: Message) {
    const { author, channel, client, content, guild } = message;

    if (author.bot) return;

    const { commands, user } = client;
    const me = guild?.members.me?.roles.botRole ?? user;
    const pattern = RegExp(`^\\s*<@!?&?(?:${user?.id}|${me?.id})>([\\w\\W]*)$`);
    const matched = content.match(pattern);

    if (!matched) return;

    message.text = matched[1].trim();

    message.args = message.text.split(/\s+/g);

    const matchedComponentLink = message.text.match(this.regexp.componentCommandNameLink) ?? [];

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