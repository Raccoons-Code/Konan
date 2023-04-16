import { cpuUsage, env, memoryUsage } from "node:process";
import client from ".";
import { Stats } from "../@types";

export default class ApplicationStats {
  botMessages = 0;
  interactions = 0;
  declare shardId: number;
  totalChannels = 0;
  totalEmojis = 0;
  totalGuilds = 0;
  totalInteractions = 0;
  totalMemoryUsage = 0;
  totalMessages = 0;
  totalShards = client.shard?.count ?? 0;
  totalUsers = 0;
  totalVoiceAdapters = 0;
  userMessages = 0;

  constructor() { }

  get channels() {
    return client.channels.cache.size;
  }

  get cpuUsage() {
    return cpuUsage();
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

  get readyAt() {
    return client.readyAt;
  }

  get readyTimestamp() {
    return client.readyTimestamp;
  }

  get shards() {
    return client.shard?.count ?? 0;
  }

  get shardIds() {
    return client.shard?.ids ?? [];
  }

  get uptime() {
    return client.uptime;
  }

  get users() {
    return client.users.cache.size;
  }

  get voiceAdapters() {
    return client.voice.adapters.size;
  }

  get workerId() {
    return env.WORKER_ID ? +env.WORKER_ID : undefined;
  }

  get workers() {
    return env.TOTAL_WORKERS ? +env.TOTAL_WORKERS : undefined;
  }

  get wsPing() {
    return client.ws.ping;
  }

  get wsStatus() {
    return client.ws.status;
  }

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
        }, values);

        for (const key of keys) {
          this[`total${key}`] = values[key];
        }

        return this;
      })
      .catch(() => this) ?? this;
  }

  toJSON(): Stats {
    return {
      botMessages: this.botMessages,
      channels: this.channels,
      cpuUsage: this.cpuUsage,
      emojis: this.emojis,
      guilds: this.guilds,
      interactions: this.interactions,
      memoryUsage: this.memoryUsage,
      messages: this.messages,
      readyAt: this.readyAt,
      readyTimestamp: this.readyTimestamp,
      shards: this.shards,
      shardId: this.shardId,
      shardIds: this.shardIds,
      totalChannels: this.totalChannels,
      totalEmojis: this.totalEmojis,
      totalGuilds: this.totalGuilds,
      totalInteractions: this.totalInteractions,
      totalMemoryUsage: this.totalMemoryUsage,
      totalMessages: this.totalMessages,
      totalShards: this.totalShards,
      totalUsers: this.totalUsers,
      totalVoiceAdapters: this.totalVoiceAdapters,
      uptime: this.uptime,
      userMessages: this.userMessages,
      users: this.users,
      voiceAdapters: this.voiceAdapters,
      workerId: this.workerId,
      workers: this.workers,
      wsPing: this.wsPing,
      wsStatus: this.wsStatus,
    };
  }
}
