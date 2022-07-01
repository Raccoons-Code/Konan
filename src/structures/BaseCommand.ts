import { Client } from 'discord.js';
import Base from './Base';

export default abstract class BaseEvent extends Base {
  client!: Client;

  constructor(client: Client) {
    super();

    Object.defineProperties(this, {
      client: { value: client },
    });
  }

  abstract execute(...args: any): Promise<any>;
}