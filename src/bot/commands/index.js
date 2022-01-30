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
    return Object.values(this.commandTypes).flat().filter(f => !/(_(?:command))/i.test(f));
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
      const elements = type.split('_');

      if (!object[elements[1]])
        Object.assign(object, { [elements[1]]: [] });

      object[elements[1]].push(type);
    }
    return this.commandTypes = object;
  }

  /**
   * @param {Function} value
   * @private
   */
  isClass(value) {
    return typeof value === 'function' && /^class.*{/.test(value.toString());
  }

  /**
   * @param {Array<String>} commandTypes
   * @private
   */
  loadCommands(commandTypes = this.commandTypes, commands = {}, client = this.client || {}) {
    Object.values(commandTypes).flat().forEach(dir => {
      const { found } = new GlobSync(`${__dirname}/${dir}/*.js`);

      for (let i = 0; i < found.length; i++) {
        const commandFile = require(found[i]);

        const command = this.isClass(commandFile) ? new commandFile(client) : commandFile;

        if (!command.data || !command.execute) continue;

        if (!commands[dir])
          commands[dir] = new Collection();

        commands[dir].set(command.data.name, command);
        command.data.aliases?.forEach(alias => commands[dir].set(alias, command));
      }
    });

    return this.commands = commands;
  }
};