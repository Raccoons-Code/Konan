import { Invite } from 'discord.js';
import { Event } from '../structures';

export default class InviteCreate extends Event<'inviteCreate'> {
  constructor() {
    super({
      intents: 'GuildInvites',
      name: 'inviteCreate',
    });
  }

  async execute(invite: Invite) {
    invite.client.stats.fetch({ filter: 'guilds' });
  }
}