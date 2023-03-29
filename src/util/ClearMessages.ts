/* eslint-disable no-await-in-loop */
import { BitField, BitFieldResolvable, EmbedBuilder, GuildMember, GuildTextBasedChannel, Interaction, Message, PermissionFlagsBits } from "discord.js";
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
  filter = ClearFiltersBitField.Default;
  author?: GuildMember;
  afterMessage?: string;
  targetUser?: string[];
  interaction?: Interaction;
  cancelled = false;

  attachments = 0;
  bots = 0;
  crossposts = 0;
  olds = 0;
  pinneds = 0;
  threads = 0;
  users = 0;
  webhooks = 0;
  targetUserMessages = 0;
  ignored = 0;
  ignoredAttachments = 0;
  ignoredBots = 0;
  ignoredCrossposts = 0;
  ignoredOlds = 0;
  ignoredPinneds = 0;
  ignoredThreads = 0;
  ignoredUsers = 0;
  ignoredWebhooks = 0;

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
  get ignoreCrossposts() {
    return this.filter.has("ignoreCrossposts");
  }
  /**
   * @default true
   */
  get ignoreOlds() {
    return true;
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
  /**
   * @default false
   */
  get ignoreWebhooks() {
    return this.filter.has("ignoreWebhooks");
  }

  async clear() {
    if (!this.channel) return this;

    while (this.afterMessage || this.amountToClear) {
      if (this.oldMessages.length) {
        await sleep(1000);

        if (this.cancelled) break;
      }

      if (!this.channel.viewable) {
        break;
      }

      if (!this.channel.permissionsFor(client.user!)?.has([
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ])) {
        break;
      }

      if (this.author) {
        if (!this.channel.permissionsFor(this.author)?.has([
          PermissionFlagsBits.ManageMessages,
        ])) {
          break;
        }
      }

      if (this.afterMessage || this.amountToClear > 100) {
        this.limit = 100;
      } else {
        this.limit = this.amountToClear;
      }

      const messages = await this.channel.messages.fetch({
        after: this.afterMessage,
        limit: this.limit,
      });

      await sleep(1000);

      if (this.cancelled) break;

      if (this.oldMessages.length) {
        messages.sweep(msg => this.oldMessages.includes(msg.id));
      }

      this.oldMessages.push(...messages.keys());

      if (!messages.size) break;

      for (const msg of messages.values()) {
        if (msg.attachments.size) {
          this.attachments++;

          if (this.ignoreAttachments)
            this.ignoredAttachments++;
        }

        if (msg.author.bot) {
          this.bots++;

          if (this.ignoreBots)
            this.ignoredBots++;
        } else {
          this.users++;

          if (this.ignoreUsers)
            this.ignoredUsers++;
        }

        if (msg.flags.any(["Crossposted", "IsCrosspost"])) {
          this.crossposts++;

          if (this.ignoreCrossposts)
            this.ignoredCrossposts++;
        }

        if (msg.pinned) {
          this.pinneds++;

          if (this.ignorePinneds)
            this.ignoredPinneds++;
        }

        if (msg.hasThread) {
          this.threads++;

          if (this.ignoreThreads)
            this.ignoredThreads++;
        }

        if (msg.webhookId) {
          this.webhooks++;

          if (this.ignoreWebhooks)
            this.ignoredWebhooks++;
        }

        if (ClearMessages.messageIsOld(msg)) {
          this.olds++;
        }

        if (this.targetUser?.includes(msg.applicationId ?? msg.author.id)) {
          this.targetUserMessages++;
        }
      }

      if (this.ignoreOlds) {
        this.ignoredOlds += this.olds;
        this.ignored += messages.sweep(msg => ClearMessages.messageIsOld(msg));
      }

      if (this.ignoreBots) {
        this.ignored += messages.sweep(msg => msg.author.bot);
      }

      if (this.ignoreAttachments) {
        this.ignored += messages.sweep(msg => msg.attachments.size);
      }

      if (this.ignoreCrossposts) {
        this.ignored += messages.sweep(msg => msg.flags.any(["Crossposted", "IsCrosspost"]));
      }

      if (this.ignorePinneds) {
        this.ignored += messages.sweep(msg => msg.pinned);
      }

      if (this.ignoreThreads) {
        this.ignored += messages.sweep(msg => msg.hasThread);
      }

      if (this.ignoreUsers) {
        this.ignored += messages.sweep(msg => !msg.author.bot);
      }

      if (this.ignoreWebhooks) {
        this.ignored += messages.sweep(msg => msg.webhookId);
      }

      if (this.targetUser) {
        this.ignored += messages.sweep(msg =>
          !this.targetUser?.includes(msg.applicationId ?? msg.author.id));
      }

      this.undeletable += messages.sweep(msg => !msg.bulkDeletable);

      const clearedMessages = await this.channel.bulkDelete(messages);

      if (!clearedMessages.size) break;

      this.cleared += clearedMessages.size;

      if (!this.afterMessage) {
        this.amountToClear -= clearedMessages.size;

        if (!this.amountToClear) break;
      }

      await sleep(1000);

      if (this.cancelled) break;

      if (this.interaction && "message" in this.interaction) {
        if (this.interaction.deferred || this.interaction.replied) {
          await this.interaction.editReply({
            embeds: [
              new EmbedBuilder(this.interaction.message?.embeds[0]?.toJSON())
                .spliceFields(1, 1, {
                  name: "Stats",
                  value: `> ${this.oldMessages.length} messages found.`
                    + `\n> ${this.cleared} deleted messages.`
                    + `\n> ${this.ignored} ignored messages.`,
                  inline: true,
                }),
            ],
          }).catch(() => null);
        }
      }
    }

    if (this.afterMessage && !this.cancelled) {
      await this.channel.messages.delete(this.afterMessage)
        .then(() => this.cleared++)
        .catch(() => null);
    }

    return this;
  }

  stop() {
    this.cancelled = true;
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

    if (options.targetUser)
      this.targetUser = Array.isArray(options.targetUser) ?
        options.targetUser :
        [options.targetUser];

    if (options.filter ?? false)
      this.filter = new ClearFiltersBitField(options.filter);

    if (options.interaction)
      this.interaction = options.interaction;

    return this;
  }

  static messageIsOld(message: Message) {
    return (Date.now() - message.createdTimestamp) >= MaxBulkDeletableMessageAge;
  }
}

export const clearFilters = [
  "ignoreAttachments",
  "ignoreBots",
  "ignoreCrossposts",
  "ignorePinneds",
  "ignoreThreads",
  "ignoreUsers",
  "ignoreWebhooks",
] as const;

export const ClearFiltersBits = makeBits(clearFilters, "number");

export class ClearFiltersBitField extends BitField<keyof typeof ClearFiltersBits, number> {
  static Flags = ClearFiltersBits;
  static All = new ClearFiltersBitField(clearFilters);
  static Default = new ClearFiltersBitField([
    ClearFiltersBits.ignoreCrossposts,
    ClearFiltersBits.ignorePinneds,
  ]);
}

export type ClearMessagesFilterResolvable = BitFieldResolvable<keyof typeof ClearFiltersBits, number>;

interface ClearMessagesOptions {
  channel: GuildTextBasedChannel | null
  author?: GuildMember | null
  amount?: number | null
  afterMessage?: string | null
  targetUser?: string | string[] | null
  filter?: ClearMessagesFilterResolvable
  interaction?: Interaction
}

interface ClearMessagesWithAmountOptions extends ClearMessagesOptions {
  amount: number
}

interface ClearMessagesWithMessageIdOptions extends ClearMessagesOptions {
  afterMessage: string
}
