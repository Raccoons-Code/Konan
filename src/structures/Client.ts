import { codeBlock } from '@discordjs/builders';
import DJS, { ClientOptions, MessageEmbed, WebhookClient } from 'discord.js';
import AutoPoster from 'topgg-autoposter';
import { FetchStatsOptions, Stats } from '../@types';
import commands from '../commands';
import { prisma } from '../database';
import events from '../events';
import { t } from '../translator';
import Util from '../util';

const { env } = process;
const { ERROR_WEBHOOK, TOPGG_TOKEN } = env;

export default class Client extends DJS.Client {
  applicationCommandTypes = commands.applicationCommandTypes;
  commandTypes = commands.commandTypes;

  constructor(options: ClientOptions) {
    super(options);

    Object.defineProperties(this, {
      prisma: { value: prisma },
      t: { value: t },
    });

    this.stats = {};
  }

  async login(token = this.token ?? undefined) {
    // process.on('unhandledRejection', this.sendError);

    commands.init(this);

    events.init(this);

    this.commands = await commands.loadCommands();

    this.commandsByCategory = commands.commandsByCategory;

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
      .setDescription(`${codeBlock(`${reason.stack}`.slice(0, 4089))}`)];

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

      this.stats.guilds = results[0]?.reduce((acc: number, guildCount: any) => acc + guildCount, 0);
      this.stats.channels = results[1]?.reduce((acc: number, channelsCount: any) => acc + channelsCount, 0);
      this.stats.members = results[2]?.reduce((acc: number, memberCount: any) => acc + memberCount, 0);
    } catch {
      return await this.fetchStats(options);
    }

    if (options.loop) {
      await Util.waitAsync(600000);

      return this.fetchStats(options);
    }

    return this.stats;
  }

  async topggAutoposter(token = TOPGG_TOKEN) {
    if (token)
      AutoPoster(token, this);
  }
}