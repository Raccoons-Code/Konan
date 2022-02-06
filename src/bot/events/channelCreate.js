const { Event } = require('../classes');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'channelCreate',
      permissions: ['SEND_MESSAGES'],
    });
  }

  async execute(channel = this.GuildChannel) {
    const { client, guild } = channel;

    if (!(guild && channel.isText() && channel.permissionsFor(client.user.id).has(this.permissions))) return;

    channel.send('First!').catch(() => null);
  }
};