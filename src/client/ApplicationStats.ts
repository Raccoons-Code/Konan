import { memoryUsage } from "node:process";
import client from ".";
import { /* FetchStatsOptions, */ Stats } from "../@types";

export default class ApplicationStats {
  // [x: string]: any;

  botMessages = 0;
  interactions = 0;
  declare shardId: number;
  totalChannels = 0;
  totalEmojis = 0;
  totalGuilds = 0;
  totalInteractions = 0;
  totalMemoryUsage = 0;
  totalMessages = 0;
  totalUsers = 0;
  totalVoiceAdapters = 0;
  userMessages = 0;

  constructor() { }

  /* get #channels() {
    if (client.shard)
      return client.shard.fetchClientValues("channels.cache.size") as Promise<number[]>;

    return Promise.all([client.channels.cache.size]);
  }

  get #emojis() {
    if (client.shard)
      return client.shard.fetchClientValues("emojis.cache.size") as Promise<number[]>;

    return Promise.all([client.emojis.cache.size]);
  }

  get #guilds() {
    if (client.shard)
      return client.shard.fetchClientValues("guilds.cache.size") as Promise<number[]>;

    return Promise.all([client.guilds.cache.size]);
  }

  get #interactions() {
    if (client.shard)
      return client.shard.fetchClientValues("appStats.interactions") as Promise<number[]>;

    return Promise.all([this.interactions]);
  }

  get #memoryUsage() {
    if (client.shard)
      return client.shard.fetchClientValues("appStats.memoryUsage.heapUsed") as Promise<number[]>;

    return Promise.all([this.memoryUsage.heapUsed]);
  }

  get #messages() {
    if (client.shard)
      return client.shard.fetchClientValues("appStats.messages") as Promise<number[]>;

    return Promise.all([this.messages]);
  }

  get #users() {
    if (client.shard)
      return client.shard.fetchClientValues("users.cache.size") as Promise<number[]>;

    return Promise.all([client.users.cache.size]);
  }

  get #voice_adapters() {
    if (client.shard)
      return client.shard.fetchClientValues("voice.adapters.size") as Promise<number[]>;

    return Promise.all([client.voice.adapters.size]);
  } */

  get channels() {
    return client.channels.cache.size;
  }

  get emojis() {
    return client.emojis.cache.size;
  }

  get guilds() {
    return client.guilds.cache.size;
  }

  get memoryUsage() {
    return memoryUsage();
  }

  get messages() {
    return this.botMessages + this.userMessages;
  }

  get shards() {
    return client.shard?.count ?? 0;
  }

  get shardIds() {
    return client.shard?.ids ?? [];
  }

  get users() {
    return client.users.cache.size;
  }

  get voiceAdapters() {
    return client.voice.adapters.size;
  }

  /* async fetch(options?: FetchStatsOptions): Promise<Stats> {
    if (!options) return this._fetch_stats();

    if (Array.isArray(options.filter)) {
      const promises = [];

      for (const filter of options.filter)
        promises.push(this.fetch({ filter }));

      await Promise.all(promises);

      return this;
    }

    await this[`_fetch_${options.filter ?? "stats"}`]();

    return this;
  } */

  /* private async _fetch_channels() {
    return this.#channels.then(channels => {
      this.totalChannels = channels.reduce((acc, channelCount) => acc + channelCount, 0);

      return this;
    });
  }

  private async _fetch_emojis() {
    return this.#emojis.then(emojis => {
      this.totalEmojis = emojis.reduce((acc, emojiCount) => acc + emojiCount, 0);

      return this;
    });
  }

  private async _fetch_guilds() {
    return this.#guilds.then(guilds => {
      this.totalGuilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);

      return this;
    });
  }

  private async _fetch_interactions() {
    return this.#interactions.then(interactions => {
      this.totalInteractions = interactions.reduce((acc, interactionCount) => acc + interactionCount, 0);

      return this;
    });
  }

  private async _fetch_memory_usage() {
    return this.#memoryUsage.then(memoryUsages => {
      this.totalMemoryUsage = memoryUsages.reduce((acc, memoryUsage) => acc + memoryUsage, 0);

      return this;
    });
  }

  private async _fetch_messages() {
    return this.#messages.then(messages => {
      this.totalMessages = messages.reduce((acc, messageCount) => acc + messageCount, 0);

      return this;
    });
  }

  private async _fetch_users() {
    return this.#users.then(users => {
      this.totalUsers = users.reduce((acc, userCount) => acc + userCount, 0);

      return this;
    });
  }

  private async _fetch_voice_adapters() {
    return this.#voice_adapters.then(voiceAdapters => {
      this.totalVoiceAdapters = voiceAdapters.reduce((acc, voiceAdapterCount) => acc + voiceAdapterCount, 0);

      return this;
    });
  } */

  async fetch() {
    return client.shard?.broadcastEval(client => ({
      Channels: client.channels.cache.size,
      Emojis: client.emojis.cache.size,
      Guilds: client.guilds.cache.size,
      Interactions: client.appStats.interactions,
      MemoryUsage: client.appStats.memoryUsage.heapUsed,
      Messages: client.appStats.messages,
      Users: client.users.cache.size,
      VoiceAdapters: client.voice.adapters.size,
    }))
      .then(result => {
        const keys = <(keyof typeof result[number])[]>Object.keys(result[0]);
        const values = keys.reduce((acc, val) => {
          acc[val] = 0;
          return acc;
        }, <Record<typeof keys[number], number>>{});

        result.reduce((acc, val) => {
          for (const key of keys) {
            acc[key] += val[key];
          }
          return acc;
        }, <Record<string, number>>values);

        for (const key of keys) {
          this[`total${key}`] = values[key];
        }

        return this;
      })
      .catch(() => this) ?? this;
  }

  /* private async _fetch_stats() {
    return Promise.all([
      this._fetch_channels(),
      this._fetch_emojis(),
      this._fetch_guilds(),
      this._fetch_interactions(),
      this._fetch_memory_usage(),
      this._fetch_messages(),
      this._fetch_users(),
      this._fetch_voice_adapters(),
    ])
      .then(() => this);
  } */

  toJSON(): Stats {
    return {
      botMessages: this.botMessages,
      channels: this.channels,
      emojis: this.emojis,
      guilds: this.guilds,
      interactions: this.interactions,
      memoryUsage: this.memoryUsage,
      messages: this.messages,
      shards: this.shards,
      shardId: this.shardId,
      shardIds: this.shardIds,
      totalChannels: this.totalChannels,
      totalEmojis: this.totalEmojis,
      totalGuilds: this.totalGuilds,
      totalInteractions: this.totalInteractions,
      totalMemoryUsage: this.totalMemoryUsage,
      totalMessages: this.totalMessages,
      totalUsers: this.totalUsers,
      totalVoiceAdapters: this.totalVoiceAdapters,
      userMessages: this.userMessages,
      users: this.users,
      voiceAdapters: this.voiceAdapters,
    };
  }
}
