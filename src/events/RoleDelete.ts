import { Role } from 'discord.js';
import { Event } from '../structures';

export default class RoleDelete extends Event<'roleDelete'> {
  constructor() {
    super({
      name: 'roleDelete',
    });
  }

  async execute(role: Role) {
    role.client.stats.fetch({ filter: 'guilds' });
  }
}