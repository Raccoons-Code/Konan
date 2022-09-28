import { Client } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import type { FetchStatsOptions, Stats } from '../@types';

export default class ApplicationStats {
  [x: string]: any;

  channels = 0;
  emojis = 0;
  guilds = 0;
  members = 0;
  messages = 0;
  threads = 0;
  users = 0;
  voiceAdapters = 0;

  constructor(private client: Client) { }

  get #channels() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('channels.cache.size') as Promise<number[]>;

    return Promise.all([this.client.channels.cache.size]);
  }

  get #emojis() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('emojis.cache.size') as Promise<number[]>;

    return Promise.all([this.client.emojis.cache.size]);
  }

  get #guilds() {
    if (this.client.shard)
      return this.client.shard.fetchClientValues('guilds.cache.size') as Promise<number[]>;

    return Promise.all([this.client.guilds.cache.size]);
  }

  get #members() {
    if (this.client.shard)
      return this.client.shard.broadcastEval<number>(client =>
        client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));

    return Promise.all([this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)]);
  }

  get #messages() {
    if (this.client.shard)
      return this.client.shard.broadcastEval<number>(client =>
        client.channels.cache.reduce((acc, channel) =>
          'messages' in channel ?
            acc + channel.messages.cache.size :
            acc, 0));

    return Promise.all([
      this.client.channels.cache.reduce((acc, channel) =>
        'messages' in channel ?
          acc + channel.messages.cache.size :
          acc, 0),
    ]);
  }

  get #threads() {
    if (this.client.shard)
      return this.client.shard.broadcastEval<number>(client =>
        client.channels.cache.reduce((acc, channel) =>
          'threads' in channel ?
            acc + channel.threads.cache.size :
            acc, 0));

    return Promise.all([
      this.client.channels.cache.reduce((acc, channel) =>
        'threads' in channel ?
          acc + channel.threads.cache.size :
          acc, 0),
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
      this.channels = channels.reduce((acc, channelCount) => acc + channelCount, 0);

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
      this.guilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);

      return this;
    });
  }

  async #fetch_members() {
    return this.#members.then(members => {
      this.members = members.reduce((acc, memberCount) => acc + memberCount, 0);

      return this;
    });
  }

  async #fetch_messages() {
    return this.#messages.then(messages => {
      this.messages = messages.reduce((acc, messageCount) => acc + messageCount, 0);

      return this;
    });
  }

  async #fetch_threads() {
    return this.#threads.then(threads => {
      this.threads = threads.reduce((acc, threadCount) => acc + threadCount, 0);

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
      this.#fetch_members(),
      this.#fetch_messages(),
      this.#fetch_threads(),
      this.#fetch_users(),
      this.#fetch_voice_adapters(),
    ])
      .then(() => this);
  }
}