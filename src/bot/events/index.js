const { BitField, Intents } = require('discord.js');
const { GlobSync } = require('glob');
const Client = require('../classes/client');

module.exports = new class {
  /** @param {Client} client */
  init(client) {
    this.client = client;
    return this;
  }

  /** @return {Array<String>} */
  get eventFiles() {
    return this._eventFiles || this.getEventFiles();
  }

  set eventFiles(value) {
    /** @private */
    this._eventFiles = value;
  }

  /** @return {Array<String|Number>|Number} */
  get intents() {
    return this._intents || this.loadIntents();
  }

  set intents(value) {
    /** @private */
    this._intents = value;
  }

  /**
   * @param {Function} value
   * @return {Boolean}
   * @private
   */
  isClass(value) {
    return typeof value === 'function' && /^class.*{/.test(value.toString());
  }

  /** @private */
  getEventFiles() {
    return this.eventFiles = new GlobSync(`${__dirname}/*.js`, { ignore: ['**/index.js'] }).found;
  }

  loadEvents(client = this.client) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile(client) : eventFile;

      client[event.listener](event.name, (...args) => event.execute(...args));
    }

    return client;
  }

  loadIntents() {
    const array = [];

    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile({}) : eventFile;

      if (event.intents?.length)
        array.push(...event.intents);
    }

    BitField.FLAGS = Intents.FLAGS;
    return this.intents = BitField.resolve([...new Set(array)]);
  }
};