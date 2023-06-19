import { Status } from "discord.js";

export interface FetchStatsOptions {
  filter?: StatsFilter | StatsFilter[]
}

export interface SelectRolesManagement {
  add: string[]
  default?: string
  remove: string[]
  unmanageable: string[]
}

export interface Stats {
  botMessages: number
  channels: number
  emojis: number
  guilds: number
  interactions: number
  isLastShard: boolean
  cpuUsage: NodeJS.CpuUsage
  memoryUsage: NodeJS.MemoryUsage
  messages: number
  readyAt: Date | null
  readyTimestamp: number | null
  shardId: number
  shardIds: number[]
  shards: number
  totalChannels: number
  totalEmojis: number
  totalGuilds: number
  totalInteractions: number
  totalMemoryUsage: number
  totalMessages: number
  totalShards: number
  totalUsers: number
  totalVoiceAdapters: number
  uptime: number | null
  usedCommands: Record<string, number>
  userMessages: number
  users: number
  voiceAdapters: number
  workerId?: number
  workers?: number
  wsPing: number | null
  wsStatus: Status
}

export type StatsFilter =
  | "channels"
  | "emojis"
  | "guilds"
  | "interactions"
  | "messages"
  | "users"
  | "voice_adapters";
