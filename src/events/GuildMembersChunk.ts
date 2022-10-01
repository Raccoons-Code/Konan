import { Collection, Guild, GuildMember } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class GuildMembersChunk extends Event<'guildMembersChunk'> {
  constructor() {
    super({
      name: 'guildMembersChunk',
    });
  }

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    members: Collection<string, GuildMember>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    guild: Guild,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: { count: number; index: number; nonce: string | undefined; },
  ) {
    appStats.fetch({ filter: 'users' });
  }
}