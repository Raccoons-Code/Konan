import { AutocompleteInteraction, BitFieldResolvable, ButtonInteraction, ChatInputCommandInteraction, Collection, CommandInteraction, ContextMenuCommandInteraction, Events, GatewayIntentsString, Interaction, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, Partials, PermissionsString, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { BaseApplicationCommand, BaseCommand, ButtonComponentInteraction, Command, MessageContextMenu, ModalSubmit, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

export * from './customid';
export * from './quickdb';
export * from './util';

export type AnyApplicationCommand = BaseApplicationCommand & (
  | ButtonComponentInteraction
  | MessageContextMenu
  | ModalSubmit
  | SelectMenuComponentInteraction
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

export interface ComponentInteractionData {
  name: string
  description: string
  appPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface EventData {
  intents?: BitFieldResolvable<GatewayIntentsString, number>
  listener?: ListenerString
  name: `${Events}`
  partials?: Partials[]
  permissions?: BitFieldResolvable<PermissionsString, bigint>
}

export type ListenerString = 'on' | 'once'

export interface FetchStatsOptions {
  loop?: boolean
  filter?: 'channels' | 'guilds' | 'members'
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
  /** @deprecated Use id instead! d22m07y2022 */
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
  guilds: number
  members: number
}