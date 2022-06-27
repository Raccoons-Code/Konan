import { Client, NonThreadGuildBasedChannel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ChannelDelete extends Event {
  constructor(client: Client) {
    super(client, {
      name: 'channelDelete',
      partials: [Partials.Channel],
    });
  }

  async execute(channel: NonThreadGuildBasedChannel) {
    channel.client.fetchStats();
  }
}