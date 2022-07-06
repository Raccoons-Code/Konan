import { Message } from 'discord.js';
import { CommandData } from '../@types';
import BaseCommand from './BaseCommand';

export default abstract class Command extends BaseCommand {
  constructor(public data: CommandData) {
    super();

    if (!this.regexCommandName(data.name))
      return <any>console.error(`Command ${data.name} cannot be loaded.`);
  }

  regexCommandName(string: string) {
    return /^[\w-]{1,32}$/.test(string);
  }

  abstract execute(message: Message): Promise<any>;
}