import { GuildMember, GuildMemberManager, PresenceStatus } from 'discord.js';

Object.defineProperty(GuildMemberManager.prototype, 'allMembersPresenceStatus', {
  get: function () {
    return this.cache.reduce((acc: Record<PresenceStatus, number>, member: GuildMember) => {
      const status = member.presence?.status ?? 'offline';

      acc[status] ? acc[status]++ : acc[status] = 1;

      return acc;
    }, <Record<PresenceStatus, number>>{
      online: 0,
      idle: 0,
      dnd: 0,
      offline: 0,
    });
  },
});