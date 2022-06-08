import { AutocompleteInteraction, ButtonInteraction, ClientEvents, Collection, CommandInteraction, ContextMenuInteraction, IntentsString, Interaction, MessageComponentInteraction, MessageContextMenuInteraction, ModalSubmitInteraction, PartialTypes, PermissionString, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import { ButtonComponentInteraction, Command, MessageContextMenu, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

export * from './customid';
export * from './quickdb';

export interface ApplicationCommandsCollection {
  [k: string]: Collection<string, Interaction & (
    AutocompleteInteraction |
    ButtonInteraction |
    CommandInteraction |
    MessageContextMenuInteraction |
    ModalSubmitInteraction |
    SelectMenuInteraction |
    UserContextMenuInteraction
  )>
}

export type CategoryTypes = 'Fun' | 'Game' | 'General' | 'Moderation' | 'Utility';

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

export interface CommandCollectionTypes {
  [k: string]: Collection<string,
    ButtonComponentInteraction |
    Command |
    MessageContextMenu |
    SelectMenuComponentInteraction |
    SlashCommand |
    UserContextMenu
  >
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

export type InteractionTypes =
  AutocompleteInteraction |
  CommandInteraction |
  ContextMenuInteraction |
  MessageComponentInteraction |
  ModalSubmitInteraction

export type ListenerString = 'on' | 'once'

export interface FetchStatsOptions {
  loop?: boolean
}

export interface PrimeResolveOptions {
  all?: boolean
}

export interface RolesManager {
  add: string[]
  default?: string
  remove: string[]
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
  ownerOnly?: boolean
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