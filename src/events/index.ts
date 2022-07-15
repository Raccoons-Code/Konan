import { Client, Intents, IntentsString, PartialTypes } from 'discord.js';
import { GlobSync } from 'glob';
import { posix } from 'node:path';
import { Event } from '../structures';
import Util from '../util';

class Events {
  private client!: Client;
  eventFiles!: string[];
  private _events!: Event[];
  intents?: number;
  partials?: PartialTypes[];
  errors: Error[] = [];

  constructor() {
    this.eventFiles = this.getEventFiles();
  }

  init(client: Client) {
    Object.defineProperties(this, { client: { value: client } });

    return this;
  }

  get events(): Event[] {
    return this._events ?? this.getEvents();
  }

  set events(value) {
    this._events = value;
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

    return events;
  }

  async loadEvents(client = this.client) {
    if (!this._events) await this.getEvents();

    for (let i = 0; i < this.eventFiles.length; i++) {
      const importedFile = await import(`${this.eventFiles[i]}`);

      const eventFile = importedFile.default ?? importedFile;

      const event = <Event>(Util.isClass(eventFile) ? new eventFile() : eventFile);

      client[event.data.listener!]?.(event.data.name, async (...args: any) => {
        try {
          await event.execute(...args);
        } catch (error: any) {
          client.sendError(error);
        }
      });
    }
  }

  async loadIntents(intents: IntentsString[] = []) {
    if (!this._events) await this.getEvents();

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data?.intents?.length)
        intents.push(...event.data.intents);
    }

    this.intents = Intents.resolve([...new Set(intents)]);

    return this.intents;
  }

  async loadPartials(partials: PartialTypes[] = []) {
    if (!this._events) await this.getEvents();

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