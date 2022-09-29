import { AnyThreadChannel, Partials } from 'discord.js';
import { Event } from '../structures';

export default class ThreadCreate extends Event<'threadCreate'> {
  constructor() {
    super({
      name: 'threadCreate',
      partials: [Partials.ThreadMember],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(thread: AnyThreadChannel<boolean>, newlyCreated: boolean) {
    thread.client.stats.fetch({ filter: 'channels' });
  }
}