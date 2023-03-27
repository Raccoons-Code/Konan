import { BotStats } from "@top-gg/sdk";
import { calculateShardId } from "discord.js";
import client, { logger } from "../../client";
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
      await api.postStats(this.getStats())
        .catch(error => logger.commonError(error));
    }
  }

  getStats(): BotStats {
    let shardId = 0;
    if (client.guilds.cache.size && client.shard) {
      shardId = calculateShardId(client.guilds.cache.firstKey()!, client.shard.count);
    }

    return {
      serverCount: client.guilds.cache.size,
      shardId,
      shardCount: client.shard?.count ?? 1,
    };
  }
}
