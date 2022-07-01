import { Client, GatewayIntentsString, IntentsBitField, Partials } from 'discord.js';
import { GlobSync } from 'glob';
import { posix } from 'node:path';
import { Event } from '../structures';
import Util from '../util';

class Events {
  #client!: Client;
  #events!: Event[];
  eventFiles!: string[];
  intents?: number;
  partials?: Partials[];
  errors: Error[] = [];

  constructor() {
    this.eventFiles = this.getEventFiles();
  }

  init(client: Client) {
    Object.defineProperties(this, { client: { value: client } });

    return this;
  }

  get events(): Event[] {
    return this.#events ?? this.getEvents();
  }

  set events(value) {
    this.#events = value;
  }

  getEventFiles() {
    return new GlobSync(posix.resolve('src', 'events', '*.@(j|t)s'), { ignore: ['**/index.@(j|t)s'] }).found;
  }

  async getEvents(events: Event[] = []) {
    for (let i = 0; i < this.eventFiles.length; i++) {
      const importedFile = await import(`${this.eventFiles[i]}`);

      const eventFile = importedFile.default ?? importedFile;

      const event = <Event>(Util.isClass(eventFile) ? new eventFile() : eventFile);

      events.push(event);
    }

    this.events = events;

    return this.events;
  }

  async loadEvents(client = this.#client) {
    if (!this.#events) await this.getEvents();

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      client[event.data.listener!]?.(event.data.name, (...args: any) => event.execute(...args));
    }
  }

  async loadIntents(intents: GatewayIntentsString[] = []) {
    if (!this.#events) await this.getEvents();

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data?.intents?.length)
        intents.push(...event.data.intents);
    }

    this.intents = IntentsBitField.resolve([...new Set(intents)]);

    return this.intents;
  }

  async loadPartials(partials: Partials[] = []) {
    if (!this.#events) await this.getEvents();

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data.partials?.length)
        partials.push(...event.data.partials);
    }

    this.partials = partials.length ? [...new Set(partials)] : partials;

    return this.partials;
  }
}

export default new Events();