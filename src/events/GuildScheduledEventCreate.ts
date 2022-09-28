import { GuildScheduledEvent, GuildScheduledEventStatus, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildScheduledEventCreate extends Event<'guildScheduledEventCreate'> {
  constructor() {
    super({
      intents: 'GuildScheduledEvents',
      name: 'guildScheduledEventCreate',
      partials: [Partials.GuildScheduledEvent],
    });
  }

  async execute(guildScheduledEvent: GuildScheduledEvent<GuildScheduledEventStatus>) {
    guildScheduledEvent.client.stats.fetch({ filter: 'guilds' });
  }
}