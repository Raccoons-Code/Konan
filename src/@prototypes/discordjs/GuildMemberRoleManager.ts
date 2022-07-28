import { GuildMemberRoleManager } from 'discord.js';

Object.defineProperty(GuildMemberRoleManager.prototype, 'lowest', {
  get: function () {
    return this.cache.reduce((prev: any, role: any) =>
      (role.id !== role.guild.id) ?
        (role.comparePositionTo(prev) < 0 ? role : prev) :
        prev, this.cache.first());
  },
});