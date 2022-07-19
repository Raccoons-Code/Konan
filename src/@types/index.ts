import { AutocompleteInteraction, BitFieldResolvable, ButtonInteraction, ChatInputCommandInteraction, ClientEvents, Collection, CommandInteraction, ContextMenuCommandInteraction, GatewayIntentsString, Interaction, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, Partials, PermissionsString, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { ButtonComponentInteraction, Command, MessageContextMenu, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

export * from './customid';
export * from './quickdb';
export * from './util';

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

export interface ApplicationCommandsCollection {
  [k: string]: Collection<string, Interaction & (
    | AutocompleteInteraction
    | ButtonInteraction
    | ChatInputCommandInteraction
    | CommandInteraction
    | MessageContextMenuCommandInteraction
    | ModalSubmitInteraction
    | SelectMenuInteraction
    | UserContextMenuCommandInteraction
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

export interface CommandChoicesData {
  name: string
  value: any
}

export interface CommandData {
  aliases?: string[]
  args?: CommandArgsData[]
  clientPermissions?: BitFieldResolvable<PermissionsString, bigint>
  description: string
  emoji?: string
  name: string
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface CommandCollectionTypes {
  [k: string]: Collection<string,
    | ButtonComponentInteraction
    | Command
    | MessageContextMenu
    | SelectMenuComponentInteraction
    | SlashCommand
    | UserContextMenu
  >
}

export interface CommandsCollection {
  [k: string]: Collection<string, Command>
}

export interface ComponentInteractionData {
  name: string
  description: string
  clientPermissions?: BitFieldResolvable<PermissionsString, bigint>
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

export interface SelectRolesItemOptionValue {
  count: number
  /** date */
  d: number
  roleId: string
}

export interface SlashCommandProps {
  category?: CategoryTypes;
  clientPermissions?: BitFieldResolvable<PermissionsString, bigint>
  ownerOnly?: boolean
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface SlashCommandsCollection {
  [k: string]: Collection<string, SlashCommand>
}

export interface Stats {
  channels: number
  guilds: number
  members: number
}