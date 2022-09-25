import { Channel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ChannelCreate extends Event<'channelCreate'> {
  constructor() {
    super({
      name: 'channelCreate',
      permissions: ['SendMessages'],
      partials: [Partials.Channel],
    });
  }

  async execute(channel: Channel) {
    channel.client.stats.fetch({ filter: 'channels' });

    this.sendFirst(channel);
  }

  async sendFirst(channel: Channel) {
    if (
      !channel.isTextBased() ||
      !channel.isDMBased() &&
      !channel.permissionsFor(channel.client.user!)?.has(this.data.permissions!)
    ) return;

    channel.send('First!').catch(() => null);
  }
}