import { Client, GuildMember } from 'discord.js';
import { Event } from '../structures';

export default class GuildMemberRemove extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILD_MEMBERS'],
      name: 'guildMemberRemove',
      partials: ['GUILD_MEMBER', 'USER'],
    });
  }

  async execute(member: GuildMember) {
    member.client.fetchStats();
  }
}