import { Client, GuildMember, Partials } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberAdd extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GuildMembers'],
      name: 'guildMemberAdd',
      partials: [Partials.GuildMember, Partials.User],
    });
  }

  async execute(member: GuildMember) {
    member.client.fetchStats();
  }
}