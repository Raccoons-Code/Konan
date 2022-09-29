import { GuildMember, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberAdd extends Event<'guildMemberAdd'> {
  constructor() {
    super({
      intents: ['GuildMembers'],
      name: 'guildMemberAdd',
      partials: [Partials.GuildMember, Partials.User],
    });
  }

  async execute(member: GuildMember) {
    member.client.stats.fetch({ filter: 'users' });
  }
}