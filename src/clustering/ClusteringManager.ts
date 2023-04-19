/* eslint-disable no-await-in-loop */
import { Collection, fetchRecommendedShardCount } from "discord.js";
import cluster from "node:cluster";
import { env } from "node:process";
import { setTimeout as sleep } from "node:timers/promises";
import sharding from "../sharding";
import { CPU_CORES } from "../util/constants";
import { waitMessageReady } from "./utils";

const shardsForWorker = new Collection<number, number[]>();
let started = false;

export default class ClusteringManager {
  totalWorkers = 0;
  totalShards = 0;

  constructor() { }

  get isPrimary() {
    return cluster.isPrimary;
  }

  private _calculateShardList(
    totalWorkers: number,
    workerIndex = 0,
    totalShards = this.totalShards,
  ) {
    if (totalShards < totalWorkers) totalWorkers = totalShards;

    const shardsInWorker = Math.floor(totalShards / totalWorkers);

    const initShardId = shardsInWorker * workerIndex;

    const finalShardId = workerIndex === totalWorkers ?
      totalShards : initShardId + shardsInWorker;

    const shardList: number[] = [];

    for (let i = initShardId; i < finalShardId; i++) {
      shardList.push(i);
    }

    return shardList;
  }

  private _fetchTotalWorkers(totalShards = this.totalShards as number) {
    return new Promise<number>((resolve, _reject) => {
      if (this.isPrimary) {
        this.totalWorkers = totalShards;

        if (CPU_CORES <= totalShards) {
          this.totalWorkers = CPU_CORES - 1;
        }

        if (CPU_CORES < 2)
          this.totalWorkers--;

        if (started) {
          resolve(this.totalWorkers);
          return;
        }

        cluster.on("message", (worker, message, _handle) => {
          if (message !== "getTotalWorkers") return;

          worker.emit("message", {
            type: "totalWorkers",
            totalWorkers: this.totalWorkers,
          });

          worker.send({
            type: "totalWorkers",
            totalWorkers: this.totalWorkers,
          }, () => null);
        });

        resolve(this.totalWorkers);
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
        if (!started) {
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
        }

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
    console.log(cluster.isPrimary ? "Primary" : `Worker ${cluster.worker?.id}`, "started.");

    this.totalShards = await this._fetchTotalShards();

    const totalWorkers = await this._fetchTotalWorkers(this.totalShards);

    if (this.isPrimary) {
      started = true;

      for (let i = 0; i < totalWorkers; i++) {
        const worker = cluster.fork({
          CLUSTERING: true,
          TOTAL_SHARDS: this.totalShards,
          TOTAL_WORKERS: totalWorkers,
          WORKER_INDEX: i,
        });

        shardsForWorker.set(worker.id, this._calculateShardList(totalWorkers, i));

        await waitMessageReady(worker);
      }

      if (!cluster.workers?.[1]) {
        await sharding.spawn({ timeout: 60_000 });
      }
    } else {
      env.WORKER_ID = `${cluster.worker?.id}`;

      sharding.shardList = this._calculateShardList(totalWorkers, Number(env.WORKER_INDEX));

      await sharding.spawn({ timeout: 60_000 });

      cluster.worker?.send("ready", () => null);
    }
  }
}
