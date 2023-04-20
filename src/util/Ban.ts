/* eslint-disable no-await-in-loop */
import { Guild, GuildMember, PermissionFlagsBits, User, userMention } from "discord.js";
import EventEmitter from "events";
import { setTimeout as sleep } from "node:timers/promises";

export interface BanEvents {
  banned: [ban: string | User | GuildMember]
  cancelled: []
  end: []
  failed: [userId: string]
}

interface Ban {
  emit: (<K extends keyof BanEvents>(event: K, ...args: BanEvents[K]) => boolean) &
  (<S extends string | symbol>(event: Exclude<S, keyof BanEvents>, ...args: any[]) => boolean);
  off: (<K extends keyof BanEvents>(event: K, listener: (...args: BanEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof BanEvents>, listener: (...args: any[]) => void) => this);
  on: (<K extends keyof BanEvents>(event: K, listener: (...args: BanEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof BanEvents>, listener: (...args: any[]) => void) => this);
  once: (<K extends keyof BanEvents>(event: K, listener: (...args: BanEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof BanEvents>, listener: (...args: any[]) => void) => this);
  removeAllListeners: (<K extends keyof BanEvents>(event?: K) => this) &
  (<S extends string | symbol>(event?: Exclude<S, keyof BanEvents>) => this);
  removeListener: (<K extends keyof BanEvents>(event: K, listener: (...args: BanEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof BanEvents>, listener: (...args: any[]) => void) => this);
}

class Ban extends EventEmitter {
  declare author: GuildMember;
  readonly banned: string[] = [];
  cancelled = false;
  deleteMessageSeconds?: number;
  readonly failed: string[] = [];
  declare guild: Guild;
  reason?: string;
  readonly usersId = new Set<string>();

  constructor(options: BanOptions) {
    super({ captureRejections: true });

    this._patch(options);
  }

  async start() {
    for (const userId of this.usersId) {
      if (this.cancelled) break;

      if (
        !this.author.permissions.has(PermissionFlagsBits.BanMembers) ||
        !this.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)
      ) {
        break;
      }

      try {
        const ban = await this.guild.bans.create(userId, {
          deleteMessageSeconds: this.deleteMessageSeconds,
          reason: this.reason,
        });

        this.banned.push(userMention(userId));

        this.emit("banned", ban);
      } catch {
        this.failed.push(userMention(userId));

        this.emit("failed", userId);
      }

      if (this.cancelled) break;

      await sleep(1000);
    }

    this.emit("end");

    return this;
  }

  stop() {
    this.cancelled = true;
    this.emit("cancelled");
    return this;
  }

  addUsersId(usersId: string | string[]) {
    this._patch({ usersId });
    return this;
  }

  setUsersId(usersId: string | string[]) {
    this.usersId.clear();
    this._patch({ usersId });
    return this;
  }

  protected _patch(options: Partial<BanOptions>) {
    if (options.author) {
      this.author = options.author;
    }

    if (options.deleteMessageSeconds) {
      this.deleteMessageSeconds = options.deleteMessageSeconds;
    }

    if (options.reason) {
      this.reason = options.reason;
    }

    if (options.usersId) {
      if (Array.isArray(options.usersId)) {
        for (const id of options.usersId) {
          this.usersId.add(id);
        }
      } else {
        this.usersId.add(options.usersId);
      }
    }
  }
}

export default Ban;

export interface BanOptions {
  author: GuildMember
  deleteMessageSeconds: number
  guild: Guild
  reason: string
  usersId: string | string[]
}
