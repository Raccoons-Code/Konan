import { Collection } from 'discord.js';
import { GlobSync } from 'glob';
import { readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { AnyCommandCollection } from '../@types';
import { client } from '../client';
import { SlashCommand } from '../structures';
import Util from '../util';

class CommandHandler {
  applicationCommandTypes: string[];
  commands!: Record<string, Collection<string, AnyCommandCollection>>;
  commandsByCategory: Record<string, Collection<string, SlashCommand>> = {};
  commandsSize: Record<string, number> = {};
  commandTypes: Record<string, string[]>;
  errors: Error[] = [];

  constructor() {
    this.commandTypes = this.getCommandTypes();
    this.applicationCommandTypes = Object.values(this.commandTypes).flat()
      .filter(f => !/(_(command|component))/i.test(f));
  }

  getCommandTypes(commandTypes: Record<string, string[]> = {}) {
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

  async loadCommands(
    commandTypes = this.commandTypes,
    commands: Record<string, Collection<string, any>> = {},
  ) {
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

        if (command.props?.category)
          this.#setCommandByCategory(command);

        commands[dir].set(command.data.name, command);

        command.data.aliases?.forEach((alias: string) => commands[dir].set(alias, command));
      }
    }

    client.commands = this.commands = commands;

    this.#afterLoadCommands();

    return commands;
  }

  async #setCommandByCategory(command: any) {
    if (!this.commandsByCategory[command.props.category])
      this.commandsByCategory[command.props.category] = new Collection();

    this.commandsByCategory[command.props.category].set(command.data.name, command);
  }

  async #afterLoadCommands() {
    this.commandsSize = Object.keys(this.commands).reduce((acc, key) =>
      ({ ...acc, [key]: this.commands[key].size }), this.commandsSize);

    this.commandsSize.applicationCommands = Object.values(this.commandsByCategory)
      .reduce((acc, category) => acc + category.size, 0);

    console.log(`Loaded ${this.commandsSize.applicationCommands} application commands.`);
  }
}

const commandHandler = new CommandHandler();

export default commandHandler;