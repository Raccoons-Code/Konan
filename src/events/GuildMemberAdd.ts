import { Client, GuildMember } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberAdd extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILD_MEMBERS'],
      name: 'guildMemberAdd',
      partials: ['GUILD_MEMBER', 'USER'],
    });
  }

  async execute(member: GuildMember) {
    member.client.fetchStats();
  }
}