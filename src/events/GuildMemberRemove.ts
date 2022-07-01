import { GuildMember, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberRemove extends Event {
  constructor() {
    super({
      intents: ['GuildMembers'],
      name: 'guildMemberRemove',
      partials: [Partials.GuildMember, Partials.User],
    });
  }

  async execute(member: GuildMember) {
    member.client.fetchStats();
  }
}