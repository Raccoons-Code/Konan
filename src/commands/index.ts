import { Collection } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { GlobSync } from 'glob';
import { join } from 'path';
import { Client, Command, SlashCommand } from '../structures';

class Commands {
  private client!: Client;
  private _applicationCommandTypes!: string[];
  private _commandTypes!: { [k: string]: string[] } | string[];
  commandsByCategory: { [k: string]: Collection<string, Command | SlashCommand> } = {};

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

  isClass(value?: any) {
    return typeof value === 'function' &&
      /^((?:class\s*)(\s+(?!extends)\S+\s*)?(?:(?:\s+extends)(\s+\S+\s*))?){/.test(value.toString());
  }

  async loadCommands(commandTypes = this.commandTypes, commands: any = {}, client = this.client) {
    const dirs = Object.values(commandTypes).flat();

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];

      commands[dir] = new Collection();

      const { found } = new GlobSync(join(__dirname, dir, '*.@(j|t)s'), { ignore: ['**/.ignore_*'] });

      for (let j = 0; j < found.length; j++) {
        const importedFile = await import(`${found[j]}`);

        const commandFile = importedFile.default ?? importedFile;

        const command = this.isClass(commandFile) ? new commandFile(client) : commandFile;

        if (!command.data || !command.execute) continue;

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