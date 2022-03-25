import { AutocompleteInteraction, ButtonInteraction, Collection, CommandInteraction, Interaction, Message, MessageContextMenuInteraction, PermissionString, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default class Command extends Base {
  constructor(client: Client, public data: CommandData) {
    super(client);
    if (!this.regexCommandName(data.name))
      return console.error(`Command ${data.name} cannot be loaded.`) as any;
  }

  regexCommandName(string: string) {
    return /^[\w-]{1,32}$/.test(string);
  }

  public async execute(message: Message) { }
}

export interface CommandData {
  aliases?: string[]
  args?: any
  clientPermissions?: PermissionString[]
  description: string
  emoji?: string
  name: string
  userPermissions?: PermissionString[]
}

export interface CommandsCollection {
  [k: string]: Collection<string, Command>
}

export interface ApplicationCommandsCollection {
  [k: string]: Collection<string, Interaction & (AutocompleteInteraction | ButtonInteraction | CommandInteraction | MessageContextMenuInteraction | SelectMenuInteraction | UserContextMenuInteraction)>
}