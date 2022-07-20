import { GuildMember, PermissionFlagsBits } from 'discord.js';

GuildMember.prototype.isManageableBy = function (member) {
  if (this.id === this.guild.ownerId) return false;
  if (member.id === this.id) return false;
  if (member.id === this.guild.ownerId) return true;
  return member.roles.highest.comparePositionTo(this.roles.highest) > 0;
};

GuildMember.prototype.isBannableBy = function (member) {
  return this.isManageableBy(member) && member.permissions.has(PermissionFlagsBits.BanMembers);
};

GuildMember.prototype.isKickableBy = function (member) {
  return this.isManageableBy(member) && member.permissions.has(PermissionFlagsBits.KickMembers);
};

GuildMember.prototype.isModeratableBy = function (member) {
  return (
    !this.permissions.has(PermissionFlagsBits.Administrator) &&
    this.isManageableBy(member) &&
    member.permissions.has(PermissionFlagsBits.ModerateMembers)
  );
};
