import { NonThreadGuildBasedChannel } from 'discord.js';
import { Client, Event } from '../structures';

export default class ChannelDelete extends Event {
  constructor(client: Client) {
    super(client, {
      name: 'channelDelete',
      partials: ['CHANNEL'],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    this.client.fetchStats();
  }
}