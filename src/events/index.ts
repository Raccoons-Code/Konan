import { GatewayIntentsString, IntentsBitField, Partials } from 'discord.js';
import { GlobSync } from 'glob';
import { posix } from 'node:path';
import client from '../client';
import { Event } from '../structures';
import Util from '../util';

class EventHandler {
  errors: Error[] = [];
  #events: Event[] = [];

  #eventFiles = this.#getEventFiles();

  get eventFiles() {
    return this.#eventFiles;
  }

  get events() {
    return this.#requireEvents();
  }

  get intents() {
    return this.#loadIntents();
  }

  get partials() {
    return this.#loadPartials();
  }

  #getEventFiles() {
    return new GlobSync(posix.resolve('src', 'events', '*.@(j|t)s'), { ignore: ['**/index.@(j|t)s'] }).found;
  }

  #requireEvents(events: Event[] = []) {
    if (this.#events.length === this.#eventFiles.length) return this.#events;

    for (let i = 0; i < this.eventFiles.length; i++) {
      const importedFile = require(`${this.eventFiles[i]}`);

      const eventFile = importedFile.default ?? importedFile;

      const event = <Event>(Util.isClass(eventFile) ? new eventFile() : eventFile);

      events.push(event);
    }

    this.#events = events;

    return events;
  }

  #loadIntents(intents: GatewayIntentsString[] = []) {
    for (let i = 0; i < this.events.length; i++) {

      const event = this.events[i];

      if (event.data?.intents?.length)
        intents.push(...event.data.intents);
    }

    intents.length ? intents = [...new Set(intents)] : intents;

    return IntentsBitField.resolve(intents);
  }

  #loadPartials(partials: Partials[] = []) {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.data.partials?.length)
        partials.push(...event.data.partials);
    }

    partials = partials.length ? [...new Set(partials)] : partials;

    return partials;
  }

  async importEvents(events: Event[] = []) {
    const importedFiles = await Promise.all(this.eventFiles.reduce((acc, file) =>
      acc.concat(import(`${file}`).then(importedFile => importedFile.default ?? importedFile)),
      <Promise<any>[]>[]));

    for (let i = 0; i < importedFiles.length; i++) {
      const importedFile = importedFiles[i];

      const eventFile = importedFile.default ?? importedFile;

      const event = <Event>(Util.isClass(eventFile) ? new eventFile() : eventFile);

      events.push(event);
    }

    return events;
  }

  async loadEvents() {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      client[event.data.listener!]?.(event.data.name, async (...args: any) => {
        try {
          await event.execute(...args);
        } catch (error: any) {
          client.sendError(error);
        }
      });
    }
  }
}

const eventHandler = new EventHandler();

export default eventHandler;