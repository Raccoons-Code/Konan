import { Guild } from 'discord.js';
import webhookLogger from '../client/WebhookLogger';
import { Event } from '../structures';

export default class GuildCreate extends Event {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildCreate',
    });
  }

  async execute(guild: Guild) {
    webhookLogger.newGuild(guild);
    guild.client.stats.fetch();
  }
}