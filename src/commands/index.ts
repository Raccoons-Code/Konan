import { Collection } from 'discord.js';
import { GlobSync } from 'glob';
import { readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import client from '../client';
import { SlashCommand } from '../structures';
import Util from '../util';

class CommandHandler {
  #applicationCommandTypes!: string[];
  #commands!: { [k: string]: Collection<string, any> };
  #commandTypes!: { [k: string]: string[] } | string[];
  commandsByCategory: { [k: string]: Collection<string, SlashCommand> } = {};
  errors: Error[] = [];

  get applicationCommandTypes(): string[] {
    return this.#applicationCommandTypes ? this.#applicationCommandTypes : this.applicationCommandTypes =
      Object.values(this.commandTypes).flat().filter((f: string) => !/(_(command|component))/i.test(f));
  }

  set applicationCommandTypes(value) {
    this.#applicationCommandTypes = value;
  }

  get commandTypes(): { [k: string]: string[] } | string[] {
    return this.#commandTypes ? this.#commandTypes : this.commandTypes = this.getCommandTypes();
  }

  set commandTypes(value) {
    this.#commandTypes = value;
  }

  get commands(): { [k: string]: Collection<string, any> } {
    return this.#commands;
  }

  getCommandTypes(commandTypes: { [k: string]: string[] } = {}) {
    const types = readdirSync(__dirname).filter(f => statSync(join(__dirname, f)).isDirectory());

    for (let i = 0; i < types.length; i++) {
      const type = types[i];

      const [value, key] = type.split('_');

      if (!commandTypes[key || value])
        Object.assign(commandTypes, { [key || value]: [] });

      commandTypes[key || value].push(type);
    }

    return commandTypes;
  }

  async loadCommands(commandTypes = this.commandTypes, commands: any = {}) {
    const dirs = Object.values(commandTypes).flat();

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];

      commands[dir] = new Collection();

      const { found } = new GlobSync(posix.resolve('src', 'commands', dir, '*.@(j|t)s'), {
        ignore: ['**/.ignore_*'],
      });

      const promises = [];

      for (let j = 0; j < found.length; j++) {
        promises.push(import(`${found[j]}`).catch(error => {
          this.errors.push(error);
        }));
      }

      const importedFiles = await Promise.all(promises);

      for (let j = 0; j < importedFiles.length; j++) {
        const importedFile = importedFiles[j];

        if (!importedFile) continue;

        const commandFile = importedFile.default ?? importedFile;

        const command = Util.isClass(commandFile) ? new commandFile() : commandFile;

        if (!(command.data && command.execute)) continue;

        if (command.props?.category) {
          if (!this.commandsByCategory[command.props.category])
            this.commandsByCategory[command.props.category] = new Collection();

          this.commandsByCategory[command.props.category].set(command.data.name, command);
        }

        commands[dir].set(command.data.name, command);

        command.data.aliases?.forEach((alias: string) => commands[dir].set(alias, command));
      }
    }

    client.commands = this.#commands = commands;

    return <{ [k: string]: Collection<string, any> }>commands;
  }
}

const commandHandler = new CommandHandler();

commandHandler.loadCommands();

export default commandHandler;