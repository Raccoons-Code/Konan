import { Invite } from 'discord.js';
import { Event } from '../structures';

export default class InviteDelete extends Event<'inviteDelete'> {
  constructor() {
    super({
      intents: 'GuildInvites',
      name: 'inviteDelete',
    });
  }

  async execute(invite: Invite) {
    invite.client.stats.fetch({ filter: 'guilds' });
  }
}