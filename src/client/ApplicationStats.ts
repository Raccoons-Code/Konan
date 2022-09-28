import { Client } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import type { ChannelStats, FetchStatsOptions, GuildStats, Stats } from '../@types';

export default class ApplicationStats {
  [x: string]: any;

  bans = 0;
  channels = 0;
  emojis = 0;
  invites = 0;
  guilds = 0;
  members = 0;
  messages = 0;
  partnered = 0;
  roles = 0;
  scheduledEvents = 0;
  stageInstances = 0;
  stickers = 0;
  threads = 0;
  users = 0;
  voiceAdapters = 0;
  voiceStates = 0;

  constructor(private client: Client) { }

  get #channels() {
    if (this.client.shard)
      return this.client.shard.broadcastEval(client =>
        client.channels.cache.reduce<ChannelStats>((acc, channel) => ({
          messages: acc.messages + ('messages' in channel ? channel.messages.cache.size : 0),
          threads: acc.threads + ('threads' in channel ? channel.threads.cache.size : 0),
          channels: acc.channels + 1,
        }), {
          channels: 0,
          messages: 0,
          threads: 0,
        }));

    return Promise.all([
      this.client.channels.cache.reduce<ChannelStats>((acc, channel) => ({
        messages: acc.messages + ('messages' in channel ? channel.messages.cache.size : 0),
        threads: acc.threads + ('threads' in channel ? channel.threads.cache.size : 0),
        channels: acc.channels + 1,
      }), {
        channels: 0,
        messages: 0,
        threads: 0,
      }),
    ]);
  }

  get #emojis() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('emojis.cache.size') as Promise<number[]>;

    return Promise.all([this.client.emojis.cache.size]);
  }

  get #guilds() {
    if (this.client.shard)
      return this.client.shard.broadcastEval(client =>
        client.guilds.cache.reduce<GuildStats>((acc, guild) => ({
          bans: acc.bans + guild.bans.cache.size,
          emojis: acc.emojis + guild.emojis.cache.size,
          guilds: acc.guilds + 1,
          invites: acc.invites + guild.invites.cache.size,
          members: acc.members + guild.memberCount,
          partnered: acc.partnered + (guild.partnered ? 1 : 0),
          roles: acc.roles + guild.roles.cache.size,
          scheduledEvents: acc.scheduledEvents + guild.scheduledEvents.cache.size,
          stageInstances: acc.stageInstances + guild.stageInstances.cache.size,
          stickers: acc.stickers + guild.stickers.cache.size,
          voiceStates: acc.voiceStates + guild.voiceStates.cache.size,
        }), {
          bans: 0,
          emojis: 0,
          guilds: 0,
          invites: 0,
          members: 0,
          partnered: 0,
          roles: 0,
          scheduledEvents: 0,
          stageInstances: 0,
          stickers: 0,
          voiceStates: 0,
        }));

    return Promise.all([
      this.client.guilds.cache.reduce<GuildStats>((acc, guild) => ({
        bans: acc.bans + guild.bans.cache.size,
        emojis: acc.emojis + guild.emojis.cache.size,
        guilds: acc.guilds + 1,
        invites: acc.invites + guild.invites.cache.size,
        members: acc.members + guild.memberCount,
        partnered: acc.partnered + (guild.partnered ? 1 : 0),
        roles: acc.roles + guild.roles.cache.size,
        scheduledEvents: acc.scheduledEvents + guild.scheduledEvents.cache.size,
        stageInstances: acc.stageInstances + guild.stageInstances.cache.size,
        stickers: acc.stickers + guild.stickers.cache.size,
        voiceStates: acc.voiceStates + guild.voiceStates.cache.size,
      }), {
        bans: 0,
        emojis: 0,
        guilds: 0,
        invites: 0,
        members: 0,
        partnered: 0,
        roles: 0,
        scheduledEvents: 0,
        stageInstances: 0,
        stickers: 0,
        voiceStates: 0,
      }),
    ]);
  }

  get #users() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('users.cache.size') as Promise<number[]>;

    return Promise.all([this.client.users.cache.size]);
  }

  get #voice_adapters() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('voice.adapters.size') as Promise<number[]>;

    return Promise.all([this.client.voice.adapters.size]);
  }

  get shards() {
    return this.client.shard?.count ?? 0;
  }

  get shardIds() {
    return this.client.shard?.ids ?? [];
  }

  async fetch(options?: FetchStatsOptions): Promise<Stats> {
    if (!options) return this.#fetch_stats().catch(() => this);

    if (Array.isArray(options.filter)) {
      const promises = [];

      for (let i = 0; i < options.filter.length; i++) {
        const filter = options.filter[i];

        promises.push(this.fetch({ filter }));
      }

      await Promise.all(promises);

      return this;
    }

    try {
      await this[`#fetch_${options.filter ?? 'stats'}`]();
    } catch {
      await waitAsync(1000);

      return this.fetch(options);
    }

    if (options.loop) {
      await waitAsync(600000);

      return this.fetch(options);
    }

    return this;
  }

  async #fetch_channels() {
    return this.#channels.then(channels => {
      Object.assign(this, this.#sumObj(channels));

      return this;
    });
  }

  async #fetch_emojis() {
    return this.#emojis.then(emojis => {
      this.emojis = emojis.reduce((acc, emojiCount) => acc + emojiCount, 0);

      return this;
    });
  }

  async #fetch_guilds() {
    return this.#guilds.then(guilds => {
      Object.assign(this, this.#sumObj(guilds));

      return this;
    });
  }

  async #fetch_users() {
    return this.#users.then(users => {
      this.users = users.reduce((acc, userCount) => acc + userCount, 0);

      return this;
    });
  }

  async #fetch_voice_adapters() {
    return this.#voice_adapters.then(voiceAdapters => {
      this.voiceAdapters = voiceAdapters.reduce((acc, voiceAdapterCount) => acc + voiceAdapterCount, 0);

      return this;
    });
  }

  async #fetch_stats() {
    return Promise.all([
      this.#fetch_channels(),
      this.#fetch_emojis(),
      this.#fetch_guilds(),
      this.#fetch_users(),
      this.#fetch_voice_adapters(),
    ])
      .then(() => this);
  }

  #sumObj<T extends Record<string, number>>(obj: T | T[]): T {
    if (!Array.isArray(obj)) return this.#sumObj([obj]);

    const result = <any>{};

    for (let i = 0; i < obj.length; i++) {
      const element = obj[i];
      const keys = Object.keys(element);

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];

        result[key] = (result[key] ?? 0) + element[key];
      }
    }

    return result;
  }
}