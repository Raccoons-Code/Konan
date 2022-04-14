import { ClientEvents } from 'discord.js';
import { EventData, ListenerString } from '../@types';
import Base from './Base';
import Client from './Client';

export default class Event extends Base {
  constructor(client: Client, public data: EventData) {
    super(client);

    data.listener = <ListenerString>data.listener?.match(/(on(ce)?)/)?.[1] || 'on';
  }

  public async execute(...args: (ClientEvents | { [key: string]: [client: Client] })[keyof ClientEvents]) { }
}