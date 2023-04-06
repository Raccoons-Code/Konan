import { BotStats } from "@top-gg/sdk";
import client, { appStats, logger } from "../../client";
import api from "./api";

export default class TopggAutoposter {
  postInterval = 1000 * 60 * 60;
  private interval?: NodeJS.Timer;

  constructor() {
    this.start();
  }

  get started() {
    return Boolean(this.interval);
  }

  start() {
    this.stop();

    if (api) {
      this.interval = setInterval(() => this.post(), this.postInterval);
    }
  }

  stop() {
    clearInterval(this.interval);
    delete this.interval;
  }

  async post() {
    if (api) {
      try {
        await api.postStats(this.getStats());
      } catch (error: any) {
        await logger.commonError(error);
      }
    }
  }

  getStats(): BotStats {
    return {
      serverCount: client.guilds.cache.size,
      shardId: appStats.shardId,
      shardCount: client.shard?.count ?? 1,
    };
  }
}
