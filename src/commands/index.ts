import { Client, Collection } from 'discord.js';
import { GlobSync } from 'glob';
import { readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { Command, SlashCommand } from '../structures';
import Util from '../util';

class Commands {
  private client!: Client;
  private _applicationCommandTypes!: string[];
  private _commandTypes!: { [k: string]: string[] } | string[];
  commandsByCategory: { [k: string]: Collection<string, SlashCommand> } = {};
  errors: Error[] = [];

  init(client: Client) {
    Object.defineProperties(this, { client: { value: client } });

    return this;
  }

  get applicationCommandTypes(): string[] {
    return this._applicationCommandTypes ? this._applicationCommandTypes : this.applicationCommandTypes =
      Object.values(this.commandTypes).flat().filter((f: string) => !/(_(command|component))/i.test(f));
  }

  set applicationCommandTypes(value) {
    this._applicationCommandTypes = value;
  }

  get commandTypes(): { [k: string]: string[] } | string[] {
    return this._commandTypes ? this._commandTypes : this.commandTypes = this.getCommandTypes();
  }

  set commandTypes(value) {
    this._commandTypes = value;
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

  async loadCommands(commandTypes = this.commandTypes, commands: any = {}, client = this.client) {
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

        const command = Util.isClass(commandFile) ? new commandFile(client) : commandFile;

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

    return <{ [k: string]: Collection<string, Command | SlashCommand> }>commands;
  }
}

export default new Commands();