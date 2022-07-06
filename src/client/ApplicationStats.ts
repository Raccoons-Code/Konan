import { Client } from 'discord.js';
import { FetchStatsOptions, Stats } from '../@types';
import Util from '../util';

export default class ApplicationStats {
  [k: string]: any;

  channels = 0;
  guilds = 0;
  members = 0;

  constructor(private client: Client) { }

  get #channels() {
    return this.client.shard?.fetchClientValues('channels.cache.size') as Promise<number[]> | undefined;
  }

  get #guilds() {
    return this.client.shard?.fetchClientValues('guilds.cache.size') as Promise<number[]> | undefined;
  }

  get #members() {
    return this.client.shard?.broadcastEval(client =>
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) as Promise<number[]> | undefined;
  }

  async fetch(options?: FetchStatsOptions): Promise<Stats | undefined> {
    if (!options) return this.#fetch_stats();

    try {
      this[`#fetch_${options.filter ?? 'stats'}`]();
    } catch {
      if (options.loop) {
        await Util.waitAsync(10000);
      } else {
        await Util.waitAsync(1000);

        return this.fetch(options);
      }
    }

    if (options.loop) {
      await Util.waitAsync(600000);

      return this.fetch(options);
    }

    return this;
  }

  async #fetch_stats() {
    return Promise.all([
      this.#guilds,
      this.#channels,
      this.#members,
    ]).then(([guilds, channels, members]) => {
      this.guilds = guilds?.reduce((acc, guildCount) => acc + guildCount, 0) ?? this.guilds;
      this.channels = channels?.reduce((acc, channelCount) => acc + channelCount, 0) ?? this.channels;
      this.members = members?.reduce((acc, memberCount) => acc + memberCount, 0) ?? this.members;

      return this;
    });
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
}