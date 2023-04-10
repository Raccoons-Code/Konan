/* eslint-disable no-await-in-loop */
import { Collection, fetchRecommendedShardCount } from "discord.js";
import cluster, { Worker } from "node:cluster";
import { EventEmitter } from "node:events";
import { env } from "node:process";
import { setTimeout as sleep } from "node:timers/promises";
import sharding from "../sharding";
import { CPU_CORES } from "../util/constants";
import "./events";

export default class ClusteringManager extends EventEmitter {
  readonly workers = new Collection<string, Worker>();

  constructor() {
    super({ captureRejections: true });
  }

  get isPrimary() {
    return cluster.isPrimary;
  }

  get totalShards() {
    if (typeof sharding.totalShards === "number") {
      return sharding.totalShards;
    }
    return 0;
  }

  private _calculateShardList(
    totalWorkers: number,
    totalShards = this.totalShards,
  ) {
    if (totalShards < totalWorkers) totalWorkers = totalShards;

    const shardsInWorker = Math.floor(totalShards / totalWorkers);

    const initShardId = shardsInWorker * ((cluster.worker?.id ?? 0) - 1);

    const finalShardId = cluster.worker?.id === totalWorkers ?
      totalShards : initShardId + shardsInWorker;

    const shardList: number[] = [];

    for (let i = initShardId; i < finalShardId; i++) {
      shardList.push(i);
    }

    return shardList;
  }

  private async _fetchTotalWorkers() {
    return new Promise<number>((resolve, _reject) => {
      if (this.isPrimary) {
        const totalShards = sharding.totalShards as number;

        let totalWorkers = totalShards;

        if (CPU_CORES <= totalShards) {
          totalWorkers = CPU_CORES - 1;
        }

        if (CPU_CORES < 2)
          totalWorkers--;

        cluster.on("message", async (worker, message, _handle) => {
          if (message !== "getTotalWorkers") return;

          worker.send({
            type: "totalWorkers",
            totalWorkers,
          }, () => null);
        });

        resolve(totalWorkers);
      } else {
        cluster.worker?.setMaxListeners(cluster.worker.getMaxListeners() + 1);

        cluster.worker?.on("message", (message) => {
          if (message?.type !== "totalWorkers") return;

          cluster.worker?.setMaxListeners((cluster.worker.getMaxListeners() || 1) - 1);

          resolve(message.totalWorkers);
        });

        cluster.worker?.send("getTotalWorkers");
      }
    });
  }

  private async _fetchTotalShards() {
    return new Promise<number>((resolve, _reject) => {
      if (this.isPrimary) {
        cluster.setMaxListeners(cluster.getMaxListeners() + 1);

        cluster.on("message", async (worker, message, _handle) => {
          if (message !== "getTotalShards") return;

          while (!this.totalShards) {
            await sleep(1000);
          }

          worker.send({
            type: "totalShards",
            totalShards: this.totalShards,
          }, () => null);
        });

        resolve(fetchRecommendedShardCount(env.DISCORD_TOKEN!));
      } else {
        cluster.worker?.setMaxListeners(cluster.worker.getMaxListeners() + 1);

        cluster.worker?.on("message", (message) => {
          if (message?.type !== "totalShards") return;

          cluster.worker?.setMaxListeners((cluster.worker.getMaxListeners() || 1) - 1);

          resolve(message.totalShards);
        });

        cluster.worker?.send("getTotalShards");
      }
    });
  }

  async spawn() {
    console.log(cluster.isPrimary ? "Primary" : "Worker", "started.");

    sharding.totalShards = await this._fetchTotalShards();

    const totalWorkers = await this._fetchTotalWorkers();

    if (this.isPrimary) {
      for (let i = 0; i < totalWorkers; i++) {
        const child = cluster.fork();

        await new Promise((resolve, _) => {
          cluster.on("message", async (worker, message, _handle) => {
            if (message !== "ready") return;
            if (child.id !== worker.id) return;

            resolve("ready");
          });
        });
      }

      if (cluster.workers) {
        for (const [id, worker] of Object.entries(cluster.workers)) {
          if (!worker) continue;
          this.workers.set(id, worker);
        }
      }

      if (!this.workers.size) {
        await sharding.spawn();
      }
    } else {
      sharding.shardList = this._calculateShardList(totalWorkers);

      await sharding.spawn();

      cluster.worker?.send("ready", () => null);
    }
  }
}
