import { GuildMember } from 'discord.js';
import { appStats } from '../client';
import { Event } from '../structures';

export default class GuildMemberAdd extends Event<'guildMemberAdd'> {
  constructor() {
    super({
      intents: ['GuildMembers'],
      name: 'guildMemberAdd',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(member: GuildMember) {
    appStats.fetch({ filter: 'users' });
  }
}