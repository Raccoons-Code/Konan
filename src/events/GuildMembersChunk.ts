import { Collection, Guild, GuildMember } from 'discord.js';
import { Event } from '../structures';

export default class GuildMembersChunk extends Event<'guildMembersChunk'> {
  constructor() {
    super({
      name: 'guildMembersChunk',
    });
  }

  async execute(
    members: Collection<string, GuildMember>,
    guild: Guild,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: { count: number; index: number; nonce: string | undefined; },
  ) {
    guild.client.stats.fetch({ filter: 'guilds' });
  }
}