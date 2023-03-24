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
  messages: number
  shardIds: number[]
  shards: number
  totalChannels: number
  totalEmojis: number
  totalGuilds: number
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
  | "users"
  | "voice_adapters";
