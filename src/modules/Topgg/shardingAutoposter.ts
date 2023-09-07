import { BotStats } from "@top-gg/sdk";
import { Stats } from "../../@types";
import { appStats, logger } from "../../client";
import { fetchShardingProcessMessage } from "../../sharding/utils";
import api from "./api";

export default class TopggShardingAutoposter {
  postInterval = 1000 * 60 * 60;
  private interval?: NodeJS.Timeout;

  constructor() { }

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
        await api.postStats(await this.getStats());
      } catch (error: any) {
        await logger.commonError(error);
      }
    }
  }

  async getStats(): Promise<BotStats> {
    const stats = await fetchShardingProcessMessage<Stats>({
      action: "stats",
    });

    return {
      serverCount: stats.reduce((a, b) => a + b.data.guilds, 0),
      shardCount: appStats.shards,
    };
  }
}
