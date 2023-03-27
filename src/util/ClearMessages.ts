/* eslint-disable no-await-in-loop */
import { BitField, BitFieldResolvable, GuildMember, GuildTextBasedChannel, Message, PermissionFlagsBits } from "discord.js";
import { setTimeout as sleep } from "node:timers/promises";
import client from "../client";
import { MaxBulkDeletableMessageAge } from "./constants";
import { makeBits } from "./utils";

export default class ClearMessages {
  amount = 0;
  amountToClear = 0;
  cleared = 0;
  limit = 0;
  undeletable = 0;

  declare channel: GuildTextBasedChannel;
  filter = ClearMessagesFiltersBitField.Default;
  author?: GuildMember;
  afterMessage?: string;
  targetMember?: string;

  attachments = 0;
  bots = 0;
  crossposteds = 0;
  olds = 0;
  pinneds = 0;
  threads = 0;
  users = 0;
  targetMemberMessages = 0;
  ignored = 0;
  ignoredAttachments = 0;
  ignoredBots = 0;
  ignoredCrossposteds = 0;
  ignoredOlds = 0;
  ignoredPinneds = 0;
  ignoredThreads = 0;
  ignoredUsers = 0;

  oldMessages: string[] = [];

  constructor(
    options:
      | ClearMessagesWithAmountOptions
      | ClearMessagesWithMessageIdOptions,
  ) {
    this._patch(options);
  }

  /**
   * @default false
   */
  get ignoreAttachments() {
    return this.filter.has("ignoreAttachments");
  }
  /**
   * @default false
   */
  get ignoreBots() {
    return this.filter.has("ignoreBots");
  }
  /**
   * @default true
   */
  get ignoreCrossposteds() {
    return this.filter.has("ignoreCrossposteds");
  }
  /**
   * @default true
   */
  get ignoreOlds() {
    return this.filter.has("ignoreOlds");
  }
  /**
   * @default true
   */
  get ignorePinneds() {
    return this.filter.has("ignorePinneds");
  }
  /**
   * @default false
   */
  get ignoreThreads() {
    return this.filter.has("ignoreThreads");
  }
  /**
   * @default false
   */
  get ignoreUsers() {
    return this.filter.has("ignoreUsers");
  }

  async clear(
    channel = this.channel,
    afterMessage = this.afterMessage,
    targetMember = this.targetMember,
  ) {
    if (!channel) return this;

    while (afterMessage || this.amountToClear) {
      if (this.oldMessages.length)
        await sleep(1000);

      if (!channel.viewable) {
        break;
      }

      if (!channel.permissionsFor(client.user!)?.has([
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ])) {
        break;
      }

      if (this.author) {
        if (!channel.permissionsFor(this.author)?.has([
          PermissionFlagsBits.ManageMessages,
        ])) {
          break;
        }
      }

      if (afterMessage || this.amountToClear > 100) {
        this.limit = 100;
      } else {
        this.limit = this.amountToClear;
      }

      const messages = await channel.messages.fetch({
        after: afterMessage,
        limit: this.limit,
      });

      if (this.oldMessages.length) {
        messages.sweep(msg => this.oldMessages.includes(msg.id));
      }

      this.oldMessages.push(...messages.keys());

      if (!messages.size) break;

      for (const message of messages.values()) {
        if (message.attachments.size) {
          this.attachments++;

          if (this.ignoreAttachments && targetMember !== message.author.id)
            this.ignoredAttachments++;
        }

        if (message.author.bot) {
          this.bots++;

          if (this.ignoreBots && targetMember !== message.author.id)
            this.ignoredBots++;
        } else {
          this.users++;

          if (this.ignoreUsers && targetMember !== message.author.id)
            this.ignoredUsers++;
        }

        if (message.flags.any(["Crossposted", "IsCrosspost"])) {
          this.crossposteds++;

          if (this.ignoreCrossposteds && targetMember !== message.author.id)
            this.ignoredCrossposteds++;
        }

        if (message.pinned) {
          this.pinneds++;

          if (this.ignorePinneds && targetMember !== message.author.id)
            this.ignoredPinneds++;
        }

        if (message.hasThread) {
          this.threads++;

          if (this.ignoreThreads && targetMember !== message.author.id)
            this.ignoredThreads++;
        }

        if (ClearMessages.messageIsOld(message))
          this.olds++;

        if (targetMember === message.author.id)
          this.targetMemberMessages++;
      }

      if (this.ignoreOlds) {
        this.ignoredOlds += this.olds;
        this.ignored += messages.sweep(msg => ClearMessages.messageIsOld(msg));
      }

      if (this.ignoreBots) {
        this.ignored += messages.sweep(msg => msg.author.bot &&
          msg.author.id !== targetMember);
      }

      if (this.ignoreAttachments) {
        this.ignored += messages.sweep(msg => msg.attachments.size &&
          msg.author.id !== targetMember);
      }

      if (this.ignoreCrossposteds) {
        this.ignored += messages.sweep(msg => msg.flags.any(["Crossposted", "IsCrosspost"]) &&
          msg.author.id !== targetMember);
      }

      if (this.ignorePinneds) {
        this.ignored += messages.sweep(msg => msg.pinned &&
          msg.author.id !== targetMember);
      }

      if (this.ignoreThreads) {
        this.ignored += messages.sweep(msg => msg.hasThread &&
          msg.author.id !== targetMember);
      }

      if (this.ignoreUsers) {
        this.ignored += messages.sweep(msg => !msg.author.bot &&
          msg.author.id !== targetMember);
      }

      if (targetMember) {
        this.ignored += messages.sweep(msg => msg.author.id !== targetMember);
      }

      this.undeletable += messages.sweep(msg => !msg.bulkDeletable);

      await sleep(1000);

      const clearedMessages = await channel.bulkDelete(messages);

      if (!clearedMessages.size) break;

      this.cleared += clearedMessages.size;

      if (!afterMessage) {
        this.amountToClear -= clearedMessages.size;

        if (!this.amountToClear) {
          break;
        }
      }

      await sleep(1000);
    }

    if (afterMessage) {
      await channel.messages.delete(afterMessage)
        .then(() => this.cleared++)
        .catch(() => null);
    }

    return this;
  }

  protected _patch(options: Partial<ClearMessagesOptions>) {
    if (!options) throw Error("Missing clear options");

    if (!options.channel)
      throw Error("Missing required channel parameter.");

    if (!(options.afterMessage || options.amount))
      throw Error("Missing required afterMessage OR amount parameters.");

    if (options.author)
      this.author = options.author;

    if (typeof options.amount === "number")
      this.amount = this.amountToClear = options.amount;

    if (options.channel)
      this.channel = options.channel;

    if (options.afterMessage)
      this.afterMessage = options.afterMessage;

    if (options.targetMember)
      this.targetMember = options.targetMember;

    if (options.addFilter ?? false)
      this.filter.add(options.addFilter!);

    if (options.remFilter ?? false)
      this.filter.remove(options.remFilter!);

    return this;
  }

  static messageIsOld(message: Message) {
    return Date.now() - message.createdTimestamp >= MaxBulkDeletableMessageAge;
  }
}

export const clearMessagesFilters = [
  "ignoreAttachments",
  "ignoreBots",
  "ignoreCrossposteds",
  "ignoreOlds",
  "ignorePinneds",
  "ignoreThreads",
  "ignoreUsers",
] as const;

export const ClearMessagesFiltersBits = makeBits(clearMessagesFilters, "number");

export class ClearMessagesFiltersBitField extends BitField<keyof typeof ClearMessagesFiltersBits, number> {
  static Flags = ClearMessagesFiltersBits;
  static All = new ClearMessagesFiltersBitField(clearMessagesFilters);
  static Default = new ClearMessagesFiltersBitField([
    ClearMessagesFiltersBits.ignoreCrossposteds,
    ClearMessagesFiltersBits.ignoreOlds,
    ClearMessagesFiltersBits.ignorePinneds,
  ]);
}

export type ClearMessagesFilterResolvable = BitFieldResolvable<keyof typeof ClearMessagesFiltersBits, number>;

interface ClearMessagesOptions {
  channel: GuildTextBasedChannel | null
  author?: GuildMember | null
  amount?: number | null
  afterMessage?: string | null
  targetMember?: string | null
  addFilter?: ClearMessagesFilterResolvable
  remFilter?: ClearMessagesFilterResolvable
}

interface ClearMessagesWithAmountOptions extends ClearMessagesOptions {
  amount: number
}

interface ClearMessagesWithMessageIdOptions extends ClearMessagesOptions {
  afterMessage: string
}
