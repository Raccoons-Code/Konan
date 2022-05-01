import { prisma } from '../database';
import { t } from '../translator';
import Util from '../util';
import Client from './Client';

export default abstract class Base {
  client!: Client;
  pattern!: typeof Util['pattern'];
  t!: typeof t;
  prisma!: typeof prisma;
  Util!: typeof Util;

  constructor(client: Client) {
    if (client) {
      Object.defineProperties(this, {
        client: { value: client },
        pattern: { value: Util.pattern },
        prisma: { value: prisma },
        t: { value: t },
        Util: { value: Util },
      });
    }
  }

  public async execute(...args: any[]) { }
}