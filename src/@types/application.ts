export interface FetchStatsOptions {
  filter?: StatsFilter | StatsFilter[]
}

export interface SelectRolesManagement {
  add: string[]
  default?: string
  remove: string[]
}

export interface Stats {
  botMessages: number
  channels: number
  emojis: number
  guilds: number
  interactions: number
  cpuUsage: NodeJS.CpuUsage
  memoryUsage: NodeJS.MemoryUsage
  messages: number
  shardId: number
  shardIds: number[]
  shards: number
  totalChannels: number
  totalEmojis: number
  totalGuilds: number
  totalInteractions: number
  totalMemoryUsage: number
  totalMessages: number
  totalUsers: number
  totalVoiceAdapters: number
  userMessages: number
  users: number
  voiceAdapters: number;
}

export type StatsFilter =
  | "channels"
  | "emojis"
  | "guilds"
  | "interactions"
  | "messages"
  | "users"
  | "voice_adapters";
