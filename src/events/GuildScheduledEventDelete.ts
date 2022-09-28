import { GuildScheduledEvent, GuildScheduledEventStatus, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildScheduledEventDelete extends Event<'guildScheduledEventDelete'> {
  constructor() {
    super({
      intents: 'GuildScheduledEvents',
      name: 'guildScheduledEventDelete',
      partials: [Partials.GuildScheduledEvent],
    });
  }

  async execute(guildScheduledEvent: GuildScheduledEvent<GuildScheduledEventStatus>) {
    guildScheduledEvent.client.stats.fetch({ filter: 'guilds' });
  }
}