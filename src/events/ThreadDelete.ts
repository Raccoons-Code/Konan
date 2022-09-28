import { AnyThreadChannel } from 'discord.js';
import { Event } from '../structures';

export default class ThreadDelete extends Event<'threadDelete'> {
  constructor() {
    super({
      name: 'threadDelete',
    });
  }

  async execute(thread: AnyThreadChannel<boolean>) {
    thread.client.stats.fetch({ filter: 'channels' });
  }
}