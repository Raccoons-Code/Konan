import { GuildMemberRoleManager, Role } from 'discord.js';

Object.defineProperty(GuildMemberRoleManager.prototype, 'lowest', {
  get: function () {
    return this.cache.reduce((prev: Role, role: Role) =>
      (role.id !== role.guild.id) ?
        (role.comparePositionTo(prev) < 0 ? role : prev) :
        prev, this.cache.first());
  },
});