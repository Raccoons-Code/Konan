const { Event } = require('../structures');
const { env } = process;
const { TEAM } = env;

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
      name: 'messageCreate',
      partials: ['CHANNEL', 'MESSAGE'],
    });

    this.messageCommandNames = [...(client?.commands?.message_command.keys() || [])];
    this.messageCommandNamesRegexp = `\\s*(${this.messageCommandNames.join('|')})?`;
  }

  async execute(message = this.Message) {
    const { author, channel, client, content, guild } = message;

    if (author.bot && !TEAM?.split(',').includes(author.id)) return;

    const { commands, user } = client;
    const botRole = guild?.me.roles.botRole || user.id;
    const regexp = RegExp(`^\\s*<@!?&?(?:${user.id}|${botRole.id})>${this.messageCommandNamesRegexp}(.*)$`);
    const matched = content.match(regexp);

    if (!matched) return;

    message.args = matched[2].trim().split(/\s+/g);
    const commandName = message.commandName = matched[1] || !matched[2] && 'help';

    if (!commandName) return;

    const command = commands.message_command.get(commandName);

    if (!command) return;

    if (!/(backup|deploy|throw)/.test(commandName))
      await channel.sendTyping();

    try {
      await command.execute(message);
    } catch (error) {
      client.sendError(error);
    }
  }
};
