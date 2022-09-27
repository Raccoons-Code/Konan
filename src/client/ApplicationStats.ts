import { Client } from 'discord.js';
import { setTimeout as waitAsync } from 'node:timers/promises';
import type { FetchStatsOptions, Stats } from '../@types';

export default class ApplicationStats {
  [x: string]: any;

  channels = 0;
  guilds = 0;
  members = 0;
  messages = 0;
  users = 0;

  constructor(private client: Client) { }

  get #channels() {
    return this.client.shard?.fetchClientValues('channels.cache.size') as Promise<number[]> | undefined;
  }

  get #guilds() {
    return this.client.shard?.fetchClientValues('guilds.cache.size') as Promise<number[]> | undefined;
  }

  get #members() {
    return this.client.shard?.broadcastEval<number>(client =>
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
  }

  get #messages() {
    return this.client.shard?.broadcastEval<number>(client =>
      client.channels.cache.reduce((acc, channel) =>
        'messages' in channel ?
          acc + channel.messages.cache.size :
          acc, 0));
  }

  get #users() {
    return this.client.shard?.fetchClientValues('users.cache.size') as Promise<number[]> | undefined;
  }

  get shards() {
    return this.client.shard?.count ?? 0;
  }

  get shardIds() {
    return this.client.shard?.ids ?? [];
  }

  async fetch(options?: FetchStatsOptions): Promise<Stats> {
    if (!options) return this.#fetch_stats().catch(() => this);

    try {
      await this[`#fetch_${options.filter ?? 'stats'}`]();
    } catch {
      await waitAsync(10000);

      return this.fetch(options);
    }

    if (options.loop) {
      await waitAsync(600000);

      return this.fetch(options);
    }

    return this;
  }

  async #fetch_channels() {
    return Promise.all([
      this.#channels,
    ]).then(([channels]) => {
      this.channels = channels?.reduce((acc, channelCount) => acc + channelCount, 0) ?? this.channels;

      return this;
    });
  }

  async #fetch_guilds() {
    return this.#fetch_stats();
  }

  async #fetch_members() {
    return Promise.all([
      this.#members,
    ]).then(([members]) => {
      this.members = members?.reduce((acc, memberCount) => acc + memberCount, 0) ?? this.members;

      return this;
    });
  }

  async #fetch_messages() {
    return Promise.all([
      this.#messages,
    ]).then(([messages]) => {
      this.messages = messages?.reduce((acc, messageCount) => acc + messageCount, 0) ?? this.messages;

      return this;
    });
  }

  async #fetch_users() {
    return Promise.all([
      this.#users,
    ]).then(([users]) => {
      this.users = users?.reduce((acc, userCount) => acc + userCount, 0) ?? this.users;

      return this;
    });
  }

  async #fetch_stats() {
    return Promise.all([
      this.#guilds,
      this.#channels,
      this.#members,
      this.#messages,
      this.#users,
    ]).then(([guilds, channels, members, messages, users]) => {
      this.guilds = guilds?.reduce((acc, guildCount) => acc + guildCount, 0) ?? this.guilds;
      this.channels = channels?.reduce((acc, channelCount) => acc + channelCount, 0) ?? this.channels;
      this.members = members?.reduce((acc, memberCount) => acc + memberCount, 0) ?? this.members;
      this.messages = messages?.reduce((acc, messageCount) => acc + messageCount, 0) ?? this.messages;
      this.users = users?.reduce((acc, userCount) => acc + userCount, 0) ?? this.users;

      return this;
    });
  }
}