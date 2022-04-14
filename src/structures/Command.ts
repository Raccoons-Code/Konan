import { Message } from 'discord.js';
import { CommandData } from '../@types';
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