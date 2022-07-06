import DJS, { ClientOptions, codeBlock, EmbedBuilder, WebhookClient } from 'discord.js';
import { env } from 'node:process';
import AutoPoster from 'topgg-autoposter';
import { FetchStatsOptions, Stats } from '../@types';
import events from '../events';
import Util from '../util';

const { ERROR_WEBHOOK, TOPGG_TOKEN } = env;

export default class Client extends DJS.Client {
  constructor(options: ClientOptions) {
    super(options);

    this.stats = {};
  }

  static init() {
    const client = new Client({
      intents: events.intents,
      failIfNotExists: false,
      partials: events.partials,
    });

    return client;
  }

  async login(token = this.token ?? undefined) {
    // process.on('unhandledRejection', this.sendError);

    await events.loadEvents();

    return super.login(token);
  }

  static login() {
    const client = this.init();

    return client.login();
  }

  async sendError(reason: Error) {
    if (!(ERROR_WEBHOOK && this.isReady()))
      return console.error(reason);

    if (!this.ERROR_WEBHOOK)
      try {
        this.ERROR_WEBHOOK = new WebhookClient({ url: ERROR_WEBHOOK });
      } catch {
        return console.error(reason);
      }

    try {
      await this.ERROR_WEBHOOK.send({
        avatarURL: this.user.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(codeBlock('ts', `${reason.stack}`.slice(0, 4087)))
            .setFields([{
              name: 'Cause',
              value: `${reason.cause}`.slice(0, 1024),
            }])
            .setTitle(`${reason.name}: ${reason.message}`.slice(0, 256)),
        ],
        username: this.user.username,
      });
    } catch {
      console.error(reason);
    }
  }

  async fetchStats(options: FetchStatsOptions = {}): Promise<Stats> {
    const promises = <(Promise<number[]> | undefined)[]>[
      this.shard?.fetchClientValues('guilds.cache.size'),
      this.shard?.fetchClientValues('channels.cache.size'),
      this.shard?.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];

    try {
      const results = await Promise.all(promises);

      this.stats.guilds = results[0]?.reduce((acc, guildCount) => acc + guildCount, 0);
      this.stats.channels = results[1]?.reduce((acc, channelCount) => acc + channelCount, 0);
      this.stats.members = results[2]?.reduce((acc, memberCount) => acc + memberCount, 0);
    } catch {
      if (options.loop) {
        await Util.waitAsync(10000);
      } else {
        await Util.waitAsync(1000);

        return this.fetchStats(options);
      }
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