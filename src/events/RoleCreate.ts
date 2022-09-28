import { Role } from 'discord.js';
import { Event } from '../structures';

export default class RoleCreate extends Event<'roleCreate'> {
  constructor() {
    super({
      name: 'roleCreate',
    });
  }

  async execute(role: Role) {
    role.client.stats.fetch({ filter: 'guilds' });
  }
}