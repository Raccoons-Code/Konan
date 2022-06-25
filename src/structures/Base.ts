import { prisma } from '../database';
import { t } from '../translator';
import Util from '../util';
import Client from './Client';
import Utils from './Utils';

export default abstract class Base extends Utils {
  client!: Client;
  getLocalizations!: typeof Util.getLocalizations;
  pattern!: typeof Util.pattern;
  t!: typeof t;
  prisma!: typeof prisma;
  Util!: typeof Util;

  constructor(client: Client) {
    super();

    Object.defineProperties(this, {
      client: { value: client },
      getLocalizations: { value: Util.getLocalizations },
      pattern: { value: Util.pattern },
      prisma: { value: prisma },
      t: { value: t },
      Util: { value: Util },
    });
  }

  abstract execute(...args: any): Promise<any>;
}