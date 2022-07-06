import { DiscordTogether } from 'discord-together';
import { Collection } from 'discord.js';
import ApplicationStats from '../../client/ApplicationStats';

declare module 'discord.js' {
  export interface Client {
    commands: { [k: string]: Collection<string, any> };
    discordTogether: DiscordTogether<{ [k: string]: string }>;
    ERROR_WEBHOOK: WebhookClient;
    invite: string;
    stats: ApplicationStats;

    sendError(reason: Error): Promise<void>
    topggAutoposter(token?: string | undefined): Promise<void>
  }

  export interface Message {
    args: string[];
    commandName: string;
    text: string;
  }
}