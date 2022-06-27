import { Guild, GuildMember, PermissionFlagsBits } from 'discord.js';

export default abstract class Utils {
  isManageable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }): boolean {
    if (target.id === guild.ownerId) return false;
    if (author.id === target.id) return false;
    if (author.id === guild.ownerId) return true;
    return author.roles.highest.comparePositionTo(target.roles.highest) > 0;
  }

  isBannable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return this.isManageable({ author, guild, target }) &&
      author.permissions.has(PermissionFlagsBits.BanMembers);
  }

  isKickable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return this.isManageable({ author, guild, target }) &&
      author.permissions.has(PermissionFlagsBits.KickMembers);
  }

  isModeratable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return (
      !target.permissions.has(PermissionFlagsBits.Administrator) &&
      this.isManageable({ author, guild, target }) &&
      author.permissions.has(PermissionFlagsBits.ModerateMembers)
    );
  }
}