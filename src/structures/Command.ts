import { AutocompleteInteraction, ButtonInteraction, Collection, CommandInteraction, Interaction, Message, MessageContextMenuInteraction, PermissionString, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default class Command extends Base {
  constructor(client: Client, public data: CommandData) {
    super(client);
    if (!this.regexCommandName(data.name))
      return <any>console.error(`Command ${data.name} cannot be loaded.`);
  }

  regexCommandName(string: string) {
    return /^[\w-]{1,32}$/.test(string);
  }

  public async execute(message: Message) { }
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

export interface CommandsCollection {
  [k: string]: Collection<string, Command>
}

export interface ApplicationCommandsCollection {
  [k: string]: Collection<string, Interaction & (AutocompleteInteraction | ButtonInteraction | CommandInteraction | MessageContextMenuInteraction | SelectMenuInteraction | UserContextMenuInteraction)>
}