import { ClientEvents } from 'discord.js';
import type { EventData, ListenerString } from '../@types';
import BaseEvent from './BaseEvent';

export default abstract class Event<K extends keyof ClientEvents> extends BaseEvent {
  constructor(public data: EventData & { name: K }) {
    super();

    data.listener = <ListenerString>data.listener?.match(/(on(ce)?)/)?.[1] || 'on';
  }

  abstract execute(...args: ClientEvents[K]): Promise<any>;
}