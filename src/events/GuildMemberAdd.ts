import { GuildMember } from 'discord.js';
import { Client, Event } from '../structures';

export default class GuildMemberAdd extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILD_MEMBERS'],
      name: 'guildMemberAdd',
      partials: ['GUILD_MEMBER', 'USER'],
    });
  }

  async execute(member: GuildMember) {
    this.client.fetchStats({ filter: [2] });
  }
}