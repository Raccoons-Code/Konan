/* eslint-disable no-await-in-loop */
import { fetchRecommendedShardCount } from "discord.js";
import cluster from "node:cluster";
import { env } from "node:process";
import { setTimeout as sleep } from "node:timers/promises";
import sharding from "../sharding";
import { CPU_CORES } from "../util/constants";
import "./events";

export default class ClusteringManager {
  constructor() { }

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

  private _fetchTotalWorkers() {
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

          worker.emit("message", {
            type: "totalWorkers",
            totalWorkers,
          });

          worker.send({
            type: "totalWorkers",
            totalWorkers,
          }, () => null);
        });

        resolve(totalWorkers);
      } else {
        cluster.worker?.setMaxListeners(cluster.worker.getMaxListeners() + 1);

        const listener = function (message: any) {
          if (message?.type !== "totalWorkers") return;

          cluster.worker?.removeListener("message", listener);

          cluster.worker?.setMaxListeners((cluster.worker.getMaxListeners() || 1) - 1);

          resolve(message.totalWorkers);
        };

        cluster.worker?.on("message", listener);

        cluster.worker?.send("getTotalWorkers");
      }
    });
  }

  private _fetchTotalShards() {
    return new Promise<number>((resolve, _reject) => {
      if (this.isPrimary) {
        cluster.setMaxListeners(cluster.getMaxListeners() + 1);

        cluster.on("message", async (worker, message, _handle) => {
          if (message !== "getTotalShards") return;

          while (!this.totalShards) {
            await sleep(1000);
          }

          worker.emit("message", {
            type: "totalShards",
            totalShards: this.totalShards,
          });

          worker.send({
            type: "totalShards",
            totalShards: this.totalShards,
          }, () => null);
        });

        console.log("Fetching shard count from Discord API...");

        resolve(fetchRecommendedShardCount(env.DISCORD_TOKEN!));
      } else {
        cluster.worker?.setMaxListeners(cluster.worker.getMaxListeners() + 1);

        const listener = function (message: any) {
          if (message?.type !== "totalShards") return;

          cluster.worker?.removeListener("message", listener);

          cluster.worker?.setMaxListeners((cluster.worker.getMaxListeners() || 1) - 1);

          resolve(message.totalShards);
        };

        cluster.worker?.on("message", listener);

        cluster.worker?.send("getTotalShards");
      }
    });
  }

  async spawn() {
    console.log(
      cluster.isPrimary ? "Primary" : `Worker ${cluster.worker?.id}`, "started.",
    );

    sharding.totalShards = await this._fetchTotalShards();

    const totalWorkers = await this._fetchTotalWorkers();

    if (this.isPrimary) {
      for (let i = 0; i < totalWorkers; i++) {
        const worker = cluster.fork({
          CLUSTERING: true,
          TOTAL_SHARDS: sharding.totalShards,
          TOTAL_WORKERS: totalWorkers,
        });

        await new Promise((resolve, _) => {
          worker.setMaxListeners(worker.getMaxListeners() + 1);

          const listener = function (message: any) {
            if (message !== "ready") return;

            worker.removeListener("message", listener);

            worker.setMaxListeners((worker.getMaxListeners() || 1) - 1);

            resolve(message);
          };

          worker.on("message", listener);
        });
      }

      if (!cluster.workers?.[1]) {
        await sharding.spawn();
      }
    } else {
      env.WORKER_ID = `${cluster.worker?.id}`;

      sharding.shardList = this._calculateShardList(totalWorkers);

      await sharding.spawn();

      cluster.worker?.send("ready", () => null);
    }
  }
}
