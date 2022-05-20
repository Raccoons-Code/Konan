import { DiscordTogether } from 'discord-together';
import { Collection } from 'discord.js';
import { FetchStatsOptions, Stats } from '..';

declare module 'discord.js' {
  export interface Client {
    applicationCommandTypes: string[];
    commands: { [k: string]: Collection<string, any> };
    commandsByCategory: { [k: string]: Collection<string, any> };
    commandTypes: { [k: string]: string[] } | string[];
    discordTogether: DiscordTogether<{ [k: string]: string }>;
    ERROR_WEBHOOK: WebhookClient;
    invite: string;
    stats: Stats;

    fetchStats(options?: FetchStatsOptions): Promise<Stats>
    sendError(reason: Error): Promise<void>
    topggAutoposter(token?: string | undefined): Promise<void>
  }

  export interface Message {
    args: string[];
    commandName: string;
    text: string;
  }
}