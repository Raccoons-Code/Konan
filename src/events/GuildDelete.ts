import { Guild } from 'discord.js';
import webhookLogger from '../client/WebhookLogger';
import { Event } from '../structures';

export default class GuildDelete extends Event<'guildDelete'> {
  constructor() {
    super({
      intents: ['Guilds'],
      name: 'guildDelete',
    });
  }

  async execute(guild: Guild) {
    webhookLogger.oldGuild(guild);
    guild.client.stats.fetch();
  }
}