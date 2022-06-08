import { Guild, GuildMember, Permissions } from 'discord.js';
import { prisma } from '../database';
import { t } from '../translator';
import Util from '../util';
import Client from './Client';

export default abstract class Base {
  client!: Client;
  getLocalizations!: typeof Util.getLocalizations;
  pattern!: typeof Util.pattern;
  t!: typeof t;
  prisma!: typeof prisma;
  Util!: typeof Util;

  constructor(client: Client) {
    Object.defineProperties(this, {
      client: { value: client },
      getLocalizations: { value: Util.getLocalizations },
      pattern: { value: Util.pattern },
      prisma: { value: prisma },
      t: { value: t },
      Util: { value: Util },
    });
  }

  isManageable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }): boolean {
    if (target.id === guild.ownerId) return false;
    if (author.id === target.id) return false;
    if (author.id === guild.ownerId) return true;
    return author.roles.highest.comparePositionTo(target.roles.highest) > 0;
  }

  isBannable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return this.isManageable({ author, guild, target }) &&
      author.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  isKickable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return this.isManageable({ author, guild, target }) &&
      author.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  isModeratable({ author, guild, target }: { author: GuildMember, guild: Guild, target: GuildMember }) {
    return (
      !target.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
      this.isManageable({ author, guild, target }) &&
      author.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
    );
  }

  public async execute(...args: any) { }
}