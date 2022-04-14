import { AutocompleteInteraction, ButtonInteraction, ClientEvents, Collection, CommandInteraction, ContextMenuInteraction, IntentsString, Interaction, MessageComponentInteraction, MessageContextMenuInteraction, PartialTypes, PermissionString, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import { Command, SlashCommand } from '../structures';

export interface ApplicationCommandsCollection {
  [k: string]: Collection<string, Interaction & (
    AutocompleteInteraction |
    ButtonInteraction |
    CommandInteraction |
    MessageContextMenuInteraction |
    SelectMenuInteraction |
    UserContextMenuInteraction
  )>
}

export interface ButtonRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
  roleId: string
}

export type CategoryTypes = 'Fun' | 'Game' | 'Moderation' | 'Utility';

export interface CommandArgsData {
  name: string
  description: string
  type: 'string' | 'number' | 'boolean'
  choices?: CommandChoicesData[]
  required?: boolean
}

export interface CommandData {
  aliases?: string[]
  args?: CommandArgsData[]
  clientPermissions?: PermissionString[]
  description: string
  emoji?: string
  name: string
  userPermissions?: PermissionString[]
}

export interface CommandChoicesData {
  name: string
  value: any
}

export interface CommandsCollection {
  [k: string]: Collection<string, Command>
}

export interface ComponentInteractionData {
  name: string
  description: string
  clientPermissions?: PermissionString[]
}

export interface EventData {
  intents?: IntentsString[]
  listener?: ListenerString
  name: keyof ClientEvents
  partials?: PartialTypes[]
  permissions?: PermissionString[]
}

export interface JkpCustomId {
  /** command */
  c: string
  /** players id */
  p: string[]
  /** value */
  v: number
}

export interface InfoCustomId {
  /** command */
  c: string
  /** sub command */
  sc: string
}

export type InteractionTypes =
  AutocompleteInteraction |
  CommandInteraction |
  ContextMenuInteraction |
  MessageComponentInteraction

export type ListenerString = 'on' | 'once'

export interface FetchStatsOptions {
  loop?: boolean
}

export interface MoviesCustomId {
  /** command */
  c: string
  d: number
  /** offset */
  o: number
  /** page */
  p: number
  target: number
}

export interface PrimeResolveOptions {
  all?: boolean
}

export interface RolesManager {
  add: string[]
  remove: string[]
}

export interface SelectRolesCustomId {
  /** command */
  c: string
  count: number
  /** date */
  d: number
}

export interface SelectRolesItemOptionValue {
  count: number
  /** date */
  d: number
  roleId: string
}

export interface SlashCommandProps {
  category?: CategoryTypes;
  clientPermissions?: PermissionString[]
  userPermissions?: PermissionString[]
}

export interface SlashCommandsCollection {
  [k: string]: Collection<string, SlashCommand>
}

export interface Stats {
  channels?: number
  guilds?: number
  members?: number
}