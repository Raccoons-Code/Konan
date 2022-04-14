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
    const { client } = channel;

    client.fetchStats();

    if (!(
      channel.isText() &&
      channel.permissionsFor(<User>client.user)?.has(this.data.permissions as PermissionString[])
    ))
      return;

    await channel.send('First!').catch(() => null);
  }
}