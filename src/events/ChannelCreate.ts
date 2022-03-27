import { NonThreadGuildBasedChannel, PermissionString, User } from 'discord.js';
import { Client, Event } from '../structures';

export default class ChannelCreate extends Event {
  constructor(client: Client) {
    super(client, {
      name: 'channelCreate',
      permissions: ['SEND_MESSAGES'],
      partials: ['CHANNEL'],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    this.client.fetchStats();

    const { client } = channel;

    if (!(channel.isText() &&
      channel.permissionsFor(client.user as User)?.has(this.data.permissions as PermissionString[])))
      return;

    await channel.send('First!').catch(() => null);
  }
}