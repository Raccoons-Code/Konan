import { Client, NonThreadGuildBasedChannel } from 'discord.js';
import { Event } from '../structures';

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

    if (!(channel.isText() && channel.permissionsFor(client.user!)?.has(this.data.permissions!))) return;

    channel.send('First!').catch(() => null);
  }
}