import { Channel } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class ChannelCreate extends Event<'channelCreate'> {
  constructor() {
    super({
      name: 'channelCreate',
      permissions: ['SendMessages'],
    });
  }

  async execute(channel: Channel) {
    appStats.fetch({ filter: 'channels' });

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