import { APIApplicationCommandOptionChoice, Guild, GuildMember, PermissionFlagsBits, PresenceStatus } from "discord.js";
import { t } from "../../translator";
import { getLocalizations } from "../utils";

export function getAllMembersPresenceStatus(guild: Guild) {
  return guild.members.cache.reduce((acc: Record<PresenceStatus, number>, member: GuildMember) => {
    const status = member.presence?.status ?? "offline";

    acc[status] ? acc[status]++ : acc[status] = 1;

    return acc;
  }, <Record<PresenceStatus, number>>{
    online: 0,
    idle: 0,
    dnd: 0,
    offline: 0,
  });
}

export function getChoicesFromEnum<
  V extends number | string = number | string,
  T extends Record<any, any> = Record<number | string, number | string>
>(
  enumType: T,
  withLocalizations = true,
): APIApplicationCommandOptionChoice<V>[] {
  return Object.entries(enumType)
    .filter(e => isNaN(<any>e[0]))
    .map(([key, value]) => ({
      name: t(key, { locale: "en" }),
      value: value as V,
      name_localizations: withLocalizations ? getLocalizations(key) : {},
    }));
}

export function isBannableBy(target: GuildMember, member: GuildMember) {
  return isManageableBy(target, member) && member.permissions.has(PermissionFlagsBits.BanMembers);
}

export function isKickableBy(target: GuildMember, member: GuildMember) {
  return isManageableBy(target, member) && member.permissions.has(PermissionFlagsBits.KickMembers);
}

export function isManageableBy(target: GuildMember, member: GuildMember) {
  if (target.id === target.guild.ownerId) return false;
  if (member.id === target.id) return false;
  if (member.id === target.guild.ownerId) return true;
  return member.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

export function isModeratableBy(target: GuildMember, member: GuildMember) {
  return (
    !target.permissions.has(PermissionFlagsBits.Administrator) &&
    isManageableBy(target, member) &&
    member.permissions.has(PermissionFlagsBits.ModerateMembers)
  );
}
