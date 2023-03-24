import client from ".";
import { FetchStatsOptions, Stats } from "../@types";

export default class ApplicationStats {
  [x: string]: any;

  botMessages = 0;
  interactions = 0;
  totalChannels = 0;
  totalEmojis = 0;
  totalGuilds = 0;
  totalUsers = 0;
  totalVoiceAdapters = 0;
  userMessages = 0;

  constructor() { }

  get #channels() {
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

  get #users() {
    if (client.shard)
      return client.shard.fetchClientValues("users.cache.size") as Promise<number[]>;

    return Promise.all([client.users.cache.size]);
  }

  get #voice_adapters() {
    if (client.shard)
      return client.shard.fetchClientValues("voice.adapters.size") as Promise<number[]>;

    return Promise.all([client.voice.adapters.size]);
  }

  get channels() {
    return client.channels.cache.size;
  }

  get emojis() {
    return client.emojis.cache.size;
  }

  get guilds() {
    return client.guilds.cache.size;
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

  async fetch(options?: FetchStatsOptions): Promise<Stats> {
    if (!options) return this.#fetch_stats().catch(() => this);

    if (Array.isArray(options.filter)) {
      const promises = [];

      for (const filter of options.filter)
        promises.push(this.fetch({ filter }));

      await Promise.all(promises);

      return this;
    }

    await this[`fetch_${options.filter ?? "stats"}`]();

    return this;
  }

  private async fetch_channels() {
    return this.#channels.then(channels => {
      this.totalChannels = channels.reduce((acc, channelCount) => acc + channelCount, 0);

      return this;
    });
  }

  private async fetch_emojis() {
    return this.#emojis.then(emojis => {
      this.totalEmojis = emojis.reduce((acc, emojiCount) => acc + emojiCount, 0);

      return this;
    });
  }

  private async fetch_guilds() {
    return this.#guilds.then(guilds => {
      this.totalGuilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);

      return this;
    });
  }

  private async fetch_users() {
    return this.#users.then(users => {
      this.totalUsers = users.reduce((acc, userCount) => acc + userCount, 0);

      return this;
    });
  }

  private async fetch_voice_adapters() {
    return this.#voice_adapters.then(voiceAdapters => {
      this.totalVoiceAdapters = voiceAdapters.reduce((acc, voiceAdapterCount) => acc + voiceAdapterCount, 0);

      return this;
    });
  }

  async #fetch_stats() {
    return Promise.all([
      this.fetch_channels(),
      this.fetch_emojis(),
      this.fetch_guilds(),
      this.fetch_users(),
      this.fetch_voice_adapters(),
    ])
      .then(() => this);
  }
}
