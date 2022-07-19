import DJS, { ClientOptions, codeBlock, EmbedBuilder, WebhookClient } from 'discord.js';
import { env } from 'node:process';
import AutoPoster from 'topgg-autoposter';
import eventHandler from '../events';
import ApplicationStats from './ApplicationStats';

const { ERROR_WEBHOOK, TOPGG_TOKEN } = env;

export default class Client extends DJS.Client {
  #ERROR_WEBHOOK!: WebhookClient;

  constructor(options: ClientOptions) {
    super(options);

    this.stats = new ApplicationStats(this);
  }

  static init() {
    return new Client({
      intents: eventHandler.intents,
      failIfNotExists: false,
      partials: eventHandler.partials,
    });
  }

  async login(token = this.token ?? undefined) {
    process.on('unhandledRejection', this.sendError);

    await eventHandler.loadEvents();

    return super.login(token);
  }

  static login() {
    const client = this.init();

    return client.login();
  }

  async sendError(reason: Error) {
    if (!(ERROR_WEBHOOK && this.isReady()))
      return console.error(reason);

    if (!this.#ERROR_WEBHOOK)
      try {
        this.#ERROR_WEBHOOK = new WebhookClient({ url: ERROR_WEBHOOK });
      } catch {
        return console.error(reason);
      }

    try {
      await this.#ERROR_WEBHOOK.send({
        avatarURL: this.user.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(codeBlock('ts', `${reason.stack}`.slice(0, 4087)))
            .setTitle(`${reason.name}: ${reason.message}`.slice(0, 256)),
        ],
        username: this.user.username,
      });
    } catch {
      console.error(reason);
    }
  }

  async topggAutoposter(token = TOPGG_TOKEN) {
    if (token)
      AutoPoster(token, this);
  }
}