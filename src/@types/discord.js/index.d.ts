import { DiscordTogether } from 'discord-together';
import { Collection } from 'discord.js';
import { FetchStatsOptions, Stats } from '..';
import { prisma } from '../../database';
import { t } from '../../translator';
import * as util from '../../util';

declare module 'discord.js' {
  export interface Client {
    applicationCommandTypes: string[];
    commands: { [k: string]: Collection<string, any> };
    commandsByCategory: { [k: string]: Collection<string, any> };
    commandTypes: { [k: string]: string[] } | string[];
    discordTogether: DiscordTogether<{ [k: string]: string }>;
    ERROR_WEBHOOK: WebhookClient;
    invite: string;
    pattern: typeof util['pattern'];
    prisma: typeof prisma;
    stats: Stats;
    t: typeof t;
    util: typeof util;

    fetchStats(options?: FetchStatsOptions): Promise<Stats>
    sendError(reason: Error): Promise<void>
    topggAutoposter(token?: string | undefined): Promise<void>
  }

  export interface Message {
    args: string[];
    commandName: string;
  }
}