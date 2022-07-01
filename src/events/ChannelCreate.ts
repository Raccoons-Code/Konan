import { NonThreadGuildBasedChannel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ChannelCreate extends Event {
  constructor() {
    super({
      name: 'channelCreate',
      permissions: ['SendMessages'],
      partials: [Partials.Channel],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    const { client } = channel;

    client.fetchStats();

    if (!(channel.isTextBased() && channel.permissionsFor(client.user!)?.has(this.data.permissions!))) return;

    channel.send('First!').catch(() => null);
  }
}