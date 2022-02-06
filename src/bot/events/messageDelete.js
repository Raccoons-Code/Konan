const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
      name: 'messageDelete',
      partials: ['CHANNEL', 'MESSAGE'],
    });
  }

  async execute(message = this.Message) {
    const { author, channel, client, content, guild, id } = message;

    if (author?.bot) return;

    const { user } = client;
    const botRole = guild?.me.roles.botRole || user.id;
    const regexp = RegExp(`^\\s*(?:<@!?&?(?:${user.id}|${botRole.id})>)(.*)$`);
    const matched = content.match(regexp);

    if (!matched) return;

    const reply = channel.messages.cache.find(msg => msg.reference?.messageId === id && msg.author.id === user.id);

    if (reply?.deletable)
      reply.delete();
  }
};