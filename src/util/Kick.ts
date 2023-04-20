/* eslint-disable no-await-in-loop */
import { Guild, GuildMember, PermissionFlagsBits, User, userMention } from "discord.js";
import EventEmitter from "events";
import { setTimeout as sleep } from "node:timers/promises";

export interface KickEvents {
  cancelled: []
  end: []
  failed: [userId: string]
  kicked: [kick: string | User | GuildMember]
}

interface Kick {
  emit: (<K extends keyof KickEvents>(event: K, ...args: KickEvents[K]) => boolean) &
  (<S extends string | symbol>(event: Exclude<S, keyof KickEvents>, ...args: any[]) => boolean);
  off: (<K extends keyof KickEvents>(event: K, listener: (...args: KickEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof KickEvents>, listener: (...args: any[]) => void) => this);
  on: (<K extends keyof KickEvents>(event: K, listener: (...args: KickEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof KickEvents>, listener: (...args: any[]) => void) => this);
  once: (<K extends keyof KickEvents>(event: K, listener: (...args: KickEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof KickEvents>, listener: (...args: any[]) => void) => this);
  removeAllListeners: (<K extends keyof KickEvents>(event?: K) => this) &
  (<S extends string | symbol>(event?: Exclude<S, keyof KickEvents>) => this);
  removeListener: (<K extends keyof KickEvents>(event: K, listener: (...args: KickEvents[K]) => void) => this) &
  (<S extends string | symbol>(event: Exclude<S, keyof KickEvents>, listener: (...args: any[]) => void) => this);
}

class Kick extends EventEmitter {
  declare author: GuildMember;
  cancelled = false;
  readonly failed: string[] = [];
  declare guild: Guild;
  readonly kicked: string[] = [];
  reason?: string;
  readonly usersId = new Set<string>();

  constructor(options: KickOptions) {
    super({ captureRejections: true });

    this._patch(options);
  }

  async start() {
    for (const userId of this.usersId.values()) {
      if (this.cancelled) break;

      if (
        !this.author.permissions.has(PermissionFlagsBits.KickMembers) ||
        !this.guild.members.me?.permissions.has(PermissionFlagsBits.KickMembers)
      ) {
        break;
      }

      try {
        const kick = await this.guild.members.kick(userId, this.reason);

        this.kicked.push(userMention(userId));

        this.emit("kicked", kick);
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

  protected _patch(options: Partial<KickOptions>) {
    if (options.author) {
      this.author = options.author;
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

export default Kick;

export interface KickOptions {
  author: GuildMember
  guild: Guild
  reason: string
  usersId: string | string[]
}
