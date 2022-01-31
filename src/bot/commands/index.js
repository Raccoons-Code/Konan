const { Collection } = require('discord.js');
const { GlobSync } = require('glob');
const Client = require('../classes/client');
const fs = require('fs');

module.exports = new class {
  /** @param {Client} client */
  init(client) {
    this.client = client;
    this.client.commandTypes = this.commandTypes;
    return this;
  }

  /** @type {Array<String>} */
  get applicationCommandTypes() {
    return this.applicationCommandTypes = Object.values(this.commandTypes).flat()
      .filter(f => !/(_(?:command))/i.test(f));
  }

  set applicationCommandTypes(value) {
    /** @private */
    this._applicationCommandTypes = value;
  }

  get applicationCommands() {
    return this._applicationCommands || this.loadCommands(this.applicationCommandTypes);
  }

  set applicationCommands(value) {
    /** @private */
    this._applicationCommands = value;
  }

  get commands() {
    return this._commands || this.loadCommands();
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
  getCommandTypes() {
    const types = fs.readdirSync(`${__dirname}`).filter(f => fs.statSync(`${__dirname}/${f}`).isDirectory());
    const object = {};

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const [value, key] = type.split('_');

      if (!object[key || value])
        Object.assign(object, { [key || value]: [] });

      object[key || value].push(type);
    }

    return this.commandTypes = object;
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

      const { found } = new GlobSync(`${__dirname}/${dir}/*.js`, { ignore: ['**/.ignore.*'] });

      for (let j = 0; j < found.length; j++) {
        const commandFile = require(found[j]);

        const command = this.isClass(commandFile) ? new commandFile(client) : commandFile;

        if (!command.data || !command.execute) continue;

        commands[dir].set(command.data.name, command);
        command.data.aliases?.forEach(alias => commands[dir].set(alias, command));
      }
    }

    return this.commands = commands;
  }
};