const { Collection } = require('discord.js');
const { GlobSync } = require('glob');
const Client = require('../structures/client');
const fs = require('fs');

module.exports = new class {
  /** @param {Client} client */
  init(client) {
    client.commandTypes = this.commandTypes;

    /** @type {Client} */
    this.client;

    Object.defineProperty(this, 'client', { value: client });

    return this;
  }

  get applicationCommands() {
    return this._applicationCommands ? this._applicationCommands :
      this.applicationCommands = this.loadCommands(this.applicationCommandTypes);
  }

  set applicationCommands(value) {
    /** @private */
    this._applicationCommands = value;
  }

  /** @type {Array<String>} */
  get applicationCommandTypes() {
    return this._applicationCommandTypes ? this._applicationCommandTypes : this.applicationCommandTypes =
      Object.values(this.commandTypes).flat().filter(f => !/(_(?:command|component))/i.test(f));
  }

  set applicationCommandTypes(value) {
    /** @private */
    this._applicationCommandTypes = value;
  }

  get commands() {
    return this._commands ? this._commands : this.commands = this.loadCommands();
  }

  set commands(value) {
    /** @private */
    this._commands = value;
  }

  /** @type {Array<String>} */
  get commandTypes() {
    return this._commandTypes || this.getCommandTypes();
  }

  set commandTypes(value) {
    /** @private */
    this._commandTypes = value;
  }

  /** @private */
  getCommandTypes(commandTypes = {}) {
    const types = fs.readdirSync(`${__dirname}`).filter(f => fs.statSync(`${__dirname}/${f}`).isDirectory());

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const [value, key] = type.split('_');

      if (!commandTypes[key || value])
        Object.assign(commandTypes, { [key || value]: [] });

        commandTypes[key || value].push(type);
    }

    return this.commandTypes = commandTypes;
  }

  /**
   * @param {Function} value
   * @private
   */
  isClass(value) {
    return typeof value === 'function' &&
      /^((?:class\s*)(\s+(?!extends)\w+\s*)?(?:(?:\s+extends)(\s+\w+\s*))?){/.test(value.toString());
  }

  /**
   * @param {Array<String>} commandTypes
   * @private
   */
  loadCommands(commandTypes = this.commandTypes, commands = {}, client = this.client || {}) {
    const dirs = Object.values(commandTypes).flat();

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];

      commands[dir] = new Collection();

      const { found } = new GlobSync(`${__dirname}/${dir}/*.js`, { ignore: ['**/.ignore_*'] });

      for (let j = 0; j < found.length; j++) {
        const commandFile = require(found[j]);

        const command = this.isClass(commandFile) ? new commandFile(client) : commandFile;

        if (!command.data || !command.execute) continue;

        commands[dir].set(command.data.name, command);

        command.data.aliases?.forEach(alias => commands[dir].set(alias, command));
      }
    }

    return commands;
  }
};