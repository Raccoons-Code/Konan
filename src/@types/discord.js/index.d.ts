import { DiscordTogether } from 'discord-together';
import { Collection } from 'discord.js';
import ApplicationStats from '../../client/ApplicationStats';

declare module 'discord.js' {
  interface Client {
    commands: Record<Collection<string, any>>;
    discordTogether: DiscordTogether<Record<string, string>>;
    invite: string;
    stats: ApplicationStats;

    sendError(reason: Error): Promise<void>
    topggAutoposter(token?: string | undefined): Promise<void>
  }

  interface Message {
    args: string[];
    commandName: string;
    text: string;
  }
}