const { ClientEvents, Intents, IntentsString, PartialTypes } = require('discord.js');
const { GlobSync } = require('glob');
const { join } = require('path');
const Client = require('../structures/client');

module.exports = new class {
  /** @param {Client} client */
  init(client) {
    /** @type {Client} */
    this.client;

    Object.defineProperty(this, 'client', { value: client });

    return this;
  }

  /** @type {string[]} */
  get eventFiles() {
    return this._eventFiles || this.getEventFiles();
  }

  set eventFiles(value) {
    /** @private */
    this._eventFiles = value;
  }

  /** @type {any[]} */
  get events() {
    return this._events || this.getEvents();
  }

  set events(value) {
    /** @private */
    this._events = value;
  }

  /** @type {number} */
  get intents() {
    return this._intents || this.loadIntents();
  }

  set intents(value) {
    /** @private */
    this._intents = value;
  }

  /** @type {PartialTypes[]} */
  get partials() {
    return this._partials || this.loadPartials();
  }

  set partials(value) {
    /** @private */
    this._partials = value;
  }

  getEventFiles() {
    return this.eventFiles = new GlobSync(join(__dirname, '*.@(j|t)s'), { ignore: ['**/index.@(j|t)s'] }).found;
  }

  getEvents(events = [], client = this.client) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile(client) : eventFile;

      events.push(event);
    }

    return this.events = events;
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

  loadEvents(events = [], client = this.client) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const eventFile = require(this.eventFiles[i]);

      const event = this.isClass(eventFile) ? new eventFile(client) : eventFile;

      events.push(event);

      client[event.data.listener](event.data.name, (...args) => event.execute(...args));
    }

    return this.events = events;
  }

  /** @param {IntentsString[]} intents */
  loadIntents(intents = []) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data.intents?.length)
        intents.push(...event.data.intents);
    }

    return this.intents = Intents.resolve([...new Set(intents)]);
  }

  /** @param {PartialTypes[]} partials */
  loadPartials(partials = []) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data.partials?.length)
        partials.push(...event.data.partials);
    }

    return this.partials = partials.length ? [...new Set(partials)] : partials;
  }
};