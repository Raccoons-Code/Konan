import DJS, { ClientOptions, DiscordjsErrorCodes, IntentsBitField } from 'discord.js';
import { env } from 'node:process';
import AutoPoster from 'topgg-autoposter';
import { logger } from '.';
import commandHandler from '../commands';
import eventHandler from '../events';
import { sweepers } from './Sweepers';

export default class Client extends DJS.Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  static init() {
    return new this({
      intents: eventHandler.intents,
      failIfNotExists: false,
      partials: eventHandler.partials,
      shards: 'auto',
      sweepers,
    });
  }

  async login(token = this.token ?? undefined) {
    process.on('uncaughtExceptionMonitor', this.sendError);

    await eventHandler.loadEvents();

    await commandHandler.loadCommands();

    try {
      return await super.login(token);
    } catch (error: any) {
      if (error.code === DiscordjsErrorCodes.DisallowedIntents) {
        this.options.intents = new IntentsBitField(this.options.intents)
          .remove('GuildMembers', 'GuildPresences', 'MessageContent')
          .bitfield;

        return super.login(token);
      }

      throw error;
    }
  }

  static login() {
    const client = this.init();

    return client.login();
  }

  async sendError(error: Error) {
    logger.commonError({ error, client: this });
  }

  async topggAutoposter(token = env.TOPGG_TOKEN) {
    if (token)
      AutoPoster(token, this);
  }
}