import { GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';
import { Event } from '../structures';

export default class GuildScheduledEventDelete extends Event<'guildScheduledEventDelete'> {
  constructor() {
    super({
      name: 'guildScheduledEventDelete',
    });
  }

  async execute(guildScheduledEvent: GuildScheduledEvent<GuildScheduledEventStatus>) {
    guildScheduledEvent.client.stats.fetch({ filter: 'guilds' });
  }
}