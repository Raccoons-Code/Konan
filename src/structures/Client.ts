import { codeBlock } from '@discordjs/builders';
import { DiscordTogether } from 'discord-together';
import DJS, { ClientOptions, Collection, MessageEmbed, WebhookClient } from 'discord.js';
import AutoPoster from 'topgg-autoposter';
import commands from '../commands';
import { prisma } from '../database';
import events from '../events';
import { t } from '../translator';
import * as util from '../util';

const { env } = process;
const { ERROR_WEBHOOK } = env;

export default class Client extends DJS.Client {
  applicationCommandTypes!: string[];
  commandTypes!: { [k: string]: string[] } | string[];
  commands!: { [k: string]: Collection<string, any> };

  pattern!: typeof util['pattern'];
  t!: typeof t;
  prisma!: typeof prisma;
  util!: typeof util;

  discordTogether!: DiscordTogether<{ [k: string]: string }>;
  invite!: string;
  totalGuilds?: number;
  totalChannels?: number;
  totalMembers?: number;
  ERROR_WEBHOOK!: WebhookClient;

  constructor(options: ClientOptions) {
    super(options);

    Object.defineProperties(this, {
      pattern: { value: util.pattern },
      prisma: { value: prisma },
      t: { value: t },
      util: { value: util },
    });
  }

  async login(token = this.token || undefined) {
    process.on('unhandledRejection', this.sendError);

    commands.init(this);

    events.init(this);

    this.applicationCommandTypes = commands.applicationCommandTypes;

    this.commandTypes = commands.commandTypes;

    this.commands = await commands.loadCommands();

    await events.loadEvents();

    return await super.login(token);
  }

  static async login(token?: string) {
    const client = new Client({
      intents: await events.loadIntents(),
      failIfNotExists: false,
      partials: await events.loadPartials(),
    });

    return client.login(token);
  }

  async sendError(reason: Error) {
    if (!ERROR_WEBHOOK || !this.isReady())
      return console.error(reason);

    if (!this.ERROR_WEBHOOK)
      this.ERROR_WEBHOOK = new WebhookClient({ url: ERROR_WEBHOOK });

    const embeds = [new MessageEmbed()
      .setColor('RED')
      .setTitle(`${reason.name}: ${reason.message}`)
      .setDescription(`${codeBlock(`${reason.stack}`).match(this.pattern.content)?.[1]}`)];

    try {
      await this.ERROR_WEBHOOK.send({
        embeds,
        avatarURL: this.user.displayAvatarURL(),
        username: this.user.username,
      });
    } catch {
      console.error(reason);
    }
  }

  async fetchStats(options: FetchStatsOptions = {}): Promise<Stats> {
    const promises = [
      this.shard?.fetchClientValues('guilds.cache.size'),
      this.shard?.fetchClientValues('channels.cache.size'),
      this.shard?.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];

    try {
      const results = await Promise.all(promises);

      this.totalGuilds = results[0]?.reduce((acc: number, guildCount: any) => acc + guildCount, 0);
      this.totalChannels = results[1]?.reduce((acc: number, channelsCount: any) => acc + channelsCount, 0);
      this.totalMembers = results[2]?.reduce((acc: number, memberCount: any) => acc + memberCount, 0);
    } catch {
      return await this.fetchStats(options);
    }

    if (options.loop) {
      await this.util.waitAsync(600000);

      return this.fetchStats(options);
    }

    return { totalChannels: this.totalChannels, totalGuilds: this.totalGuilds, totalMembers: this.totalMembers };
  }

  async topggautoposter(token = this.token as string) {
    AutoPoster(token, this);
  }
}

export interface FetchStatsOptions {
  loop?: boolean
}

export interface Stats {
  totalChannels?: number
  totalGuilds?: number
  totalMembers?: number
}