import { PermissionString } from 'discord.js';
import { prisma } from '../database';
import { t } from '../translator';
import * as util from '../util';
import Client from './Client';

export default abstract class Base {
  client!: Client;
  pattern!: typeof util['pattern'];
  t!: typeof t;
  prisma!: typeof prisma;
  util!: typeof util;

  constructor(client: Client) {
    if (client) {
      Object.defineProperties(this, {
        client: { value: client },
        pattern: { value: util.pattern },
        prisma: { value: prisma },
        t: { value: t },
        util: { value: util },
      });
    }
  }

  async execute(...args: any[]) { }
}

export interface ComponentInteractionData {
  name: string
  description: string
  clientPermissions?: PermissionString[]
}