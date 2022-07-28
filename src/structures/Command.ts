import { Message } from 'discord.js';
import { CommandData } from '../@types';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class Command extends BaseApplicationCommand {
  constructor(public data: CommandData) {
    super();

    if (!this.#regexCommandName(data.name))
      return console.error(`Command ${data.name} cannot be loaded.`)!;
  }

  #regexCommandName(string: string) {
    return /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(string);
  }

  abstract execute(message: Message): Promise<any>;
}