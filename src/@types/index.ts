import { AutocompleteInteraction, BitFieldResolvable, ButtonInteraction, ChatInputCommandInteraction, ClientEvents, Collection, CommandInteraction, ContextMenuCommandInteraction, GatewayIntentsString, Interaction, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, Partials, PermissionsString, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { BaseApplicationCommand, BaseCommand, ButtonComponentInteraction, Command, MessageContextMenu, ModalSubmit, SelectMenuComponentInteraction, SlashAutocomplete, SlashCommand, UserContextMenu } from '../structures';

export * from './customid';
export * from './quickdb';
export * from './util';

export type AnyApplicationCommand = BaseApplicationCommand & (
  | ButtonComponentInteraction
  | MessageContextMenu
  | ModalSubmit
  | SelectMenuComponentInteraction
  | SlashAutocomplete
  | SlashCommand
  | UserContextMenu
)

export type AnyCommandCollection = Record<string, Collection<string, AnyCommand>>

export type AnyCommand = BaseCommand & (
  | Command
)

export type AnyInteraction = Interaction & (
  | AutocompleteInteraction
  | ButtonInteraction
  | ChatInputCommandInteraction
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MessageComponentInteraction
  | MessageContextMenuCommandInteraction
  | ModalSubmitInteraction
  | SelectMenuInteraction
  | UserContextMenuCommandInteraction
)

export type ApplicationCommandCollection = Record<string, Collection<string, AnyApplicationCommand>>

export enum CommandCategory {
  Fun = 'Fun',
  Game = 'Game',
  General = 'General',
  Moderation = 'Moderation',
  Utility = 'Utility',
}

export interface CommandArgsData {
  name: string
  description: string
  type: 'string' | 'number' | 'boolean'
  choices?: CommandChoicesData[]
  required?: boolean
}

export interface CommandChoicesData {
  name: string
  value: any
}

export type CommandCollection = Record<string, Collection<string, Command>>

export interface CommandData {
  aliases?: string[]
  args?: CommandArgsData[]
  appPermissions?: BitFieldResolvable<PermissionsString, bigint>
  description: string
  emoji?: string
  name: string
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface ApplicationInteractionData {
  name: string
  description?: string
  appPermissions?: BitFieldResolvable<PermissionsString, bigint>
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface EventData {
  intents?: BitFieldResolvable<GatewayIntentsString, number>
  listener?: ListenerString
  name: keyof ClientEvents
  partials?: Partials[]
  permissions?: BitFieldResolvable<PermissionsString, bigint>
}

export type ListenerString = 'on' | 'once'

export interface FetchStatsOptions {
  loop?: boolean
  filter?: StatsFilter | StatsFilter[]
}

export interface PrimeResolveOptions {
  all?: boolean
}

export interface RolesManager {
  add: string[]
  default?: string
  remove: string[]
}

export interface SelectRolesOptionValue {
  count: number
  id: string
  /** @deprecated Use id instead! d22mnumber7y2number22 */
  roleId?: string
}

export interface SlashCommandProps {
  appPermissions?: BitFieldResolvable<PermissionsString, bigint>
  category?: `${CommandCategory}`
  ownerOnly?: boolean
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface Stats {
  channels: number
  emojis: number
  guilds: number
  shardIds: number[]
  shards: number
  users: number
  voiceAdapters: number;
}

export type StatsFilter =
  | 'channels'
  | 'emojis'
  | 'guilds'
  | 'users'
  | 'voice_adapters'

export interface GuildStats {
  bans: number
  emojis: number
  invites: number
  members: number
  partnered: number
  roles: number
  scheduledEvents: number
  stageInstances: number
  stickers: number
  voiceStates: number
  guilds: number
}

export interface ChannelStats {
  channels: number
  messages: number
  threads: number
}