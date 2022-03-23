import { ClientEvents, IntentsString, PartialTypes, PermissionString } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default class Event extends Base {
  constructor(client: Client, public data: EventData) {
    super(client);
    data.listener = data.listener?.match(/(on(ce)?)/)?.[1] as ListenerString || 'on';
  }

  async execute(...args: (ClientEvents | { [key: string]: [client: Client] })[keyof ClientEvents]) { }
}

export interface EventData {
  intents?: IntentsString[]
  listener?: ListenerString
  name: keyof ClientEvents
  partials?: PartialTypes[]
  permissions?: PermissionString[]
}

export type ListenerString = 'on' | 'once'