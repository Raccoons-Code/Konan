import { prisma } from '../database';
import { t } from '../translator';
import Util from '../util';
import Utils from './Utils';

export default abstract class Base extends Utils {
  getLocalizations!: typeof Util.getLocalizations;
  regexp!: typeof Util.regexp;
  t!: typeof t;
  prisma!: typeof prisma;
  Util!: typeof Util;

  constructor() {
    super();

    Object.defineProperties(this, {
      getLocalizations: { value: Util.getLocalizations },
      regexp: { value: Util.regexp },
      prisma: { value: prisma },
      t: { value: t },
      Util: { value: Util },
    });
  }

  abstract execute(...args: any): Promise<any>;
}