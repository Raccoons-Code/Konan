const { Event } = require('../structures');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
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
    const matched = content?.match(regexp);

    if (!matched) return;

    const messages = await channel.messages.fetch({ after: id });

    const reply = messages.find(m => m.author.id === user.id && m.reference?.messageId === id);

    if (reply?.deletable)
      await reply.delete();
  }
};