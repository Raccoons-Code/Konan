const { BitField, ClientEvents, Intents, IntentsString, PartialTypes } = require('discord.js');
const { GlobSync } = require('glob');
const Client = require('../structures/client');

module.exports = new class {
  /** @param {Client} client */
  init(client) {
    /** @type {Client} */
    this.client;

    Object.defineProperty(this, 'client', { value: client });

    return this;
  }

  get events() {
    return this._events || this.getEvents();
  }

  set events(events) {
    /** @private */
    this._events = events;
  }

  /** @return {Array<String>} */
  get eventFiles() {
    return this._eventFiles || this.getEventFiles();
  }

  set eventFiles(eventFiles) {
    /** @private */
    this._eventFiles = eventFiles;
  }

  /** @return {Array<String|Number>|Number} */
  get intents() {
    return this._intents || this.loadIntents();
  }

  set intents(intents) {
    /** @private */
    this._intents = intents;
  }

  get partials() {
    return this._partials || this.loadPartials();
  }

  set partials(partials) {
    /** @private */
    this._partials = partials;
  }

  /**
   * @param {Function} value
   * @return {Boolean}
   * @private
   */
  isClass(value) {
    return typeof value === 'function' &&
      /^((?:class\s*)(\s+(?!extends)\w+\s*)?(?:(?:\s+extends)(\s+\w+\s*))?){/.test(value.toString());
  }

  /** @private */
  getEventFiles() {
    return this.eventFiles = new GlobSync(`${__dirname}/*.js`, { ignore: ['**/index.js'] }).found;
  }

  getEvents(events = [], client = this.client || {}) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile(client) : eventFile;

      events.push(event);
    }

    return this.events = events;
  }

  /** @param {Array<keyof(ClientEvents)>} events */
  loadEvents(events = [], client = this.client) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile(client) : eventFile;

      events.push(event);

      client[event.listener](event.name, (...args) => event.execute(...args));
    }

    return this.events = events;
  }

  /** @param {IntentsString[]} intents */
  loadIntents(intents = []) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.intents?.length)
        intents.push(...event.intents);
    }

    BitField.FLAGS = Intents.FLAGS;

    return this.intents = BitField.resolve([...new Set(intents)]);
  }

  /** @param {PartialTypes[]} partials */
  loadPartials(partials = []) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.partials?.length)
        partials.push(...event.partials);
    }

    return this.partials = [...new Set(partials)];
  }
};