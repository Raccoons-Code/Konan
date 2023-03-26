import { BotStats } from "@top-gg/sdk";
import { logger } from "../../client";
import sharding from "../../sharding";
import api from "./api";

export default class TopggShardingAutoposter {
  postInterval = 1000 * 60 * 60;
  interval?: NodeJS.Timer;

  constructor() { }

  get started() {
    return Boolean(this.interval);
  }

  start() {
    this.stop();

    if (api) {
      this.interval = setInterval(async () => {
        await this.post();
      }, this.postInterval);
    }
  }

  stop() {
    clearInterval(this.interval);
    delete this.interval;
  }

  async post() {
    if (api) {
      await api.postStats(await this.getStats())
        .catch(error => logger.commonError(error));
    }
  }

  async getStats(): Promise<BotStats> {
    const guilds = await sharding.fetchClientValues("guilds.cache.size") as number[];

    return {
      serverCount: guilds.reduce((a, b) => a + b, 0),
      shardCount: guilds.length,
    };
  }
}
