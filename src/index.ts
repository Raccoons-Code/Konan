/* eslint-disable no-await-in-loop */
import { fetchRecommendedShardCount } from "discord.js";
import "dotenv/config";
import { env } from "node:process";
import { setTimeout as sleep } from "node:timers/promises";
import pm2 from "pm2";
import { BaseData } from "./@types";
import sharding from "./sharding";

const INSTANCE_ID = Number(env.PM2_INSTANCE_ID);

if (isNaN(INSTANCE_ID)) {
  sharding.spawn({ timeout: 60_000 });
} else {
  console.log("Cluster", INSTANCE_ID, "started at", new Date().toLocaleString());

  let TOTAL_SHARDS: number;

  console.log("Cluster", INSTANCE_ID, "connected");

  pm2.list(function (err, processes) {
    console.log("Cluster", INSTANCE_ID, "trying to list clusters");

    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log("Cluster", INSTANCE_ID, "listed", processes.length, "clusters");

    const calculateShards = function () {
      const shardsInCluster = Math.floor(TOTAL_SHARDS / processes.length);

      const initShardId = shardsInCluster * INSTANCE_ID;

      const finalShardId = initShardId + shardsInCluster;

      sharding.shardList = [];

      for (let i = initShardId; i < finalShardId; i++) {
        sharding.shardList.push(i);
      }
    };

    if (INSTANCE_ID) {
      pm2.sendDataToProcessId(0, {
        id: 0,
        data: { id: INSTANCE_ID },
        topic: "getTotalShards",
      }, async function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        await new Promise((resolve, _) => {
          const listener = function (message: BaseData) {
            console.log(
              "Cluster",
              message.id,
              "received message from",
              message.data.id,
              "with topic:",
              message.topic,
            );

            if (message.topic === "setTotalShards") {
              sharding.totalShards = TOTAL_SHARDS = message.data.totalShards;

              calculateShards();

              process.removeListener("message", listener);

              resolve(sharding.spawn({ timeout: 60_000 }));
            }
          };

          process.on("message", listener);
        });
      });
    } else {
      process.on("message", async function (message: BaseData) {
        console.log(
          "Cluster",
          message.id,
          "received message from",
          message.data.id,
          "with topic:",
          message.topic,
        );

        if (message.topic === "getTotalShards") {
          while (!TOTAL_SHARDS) {
            await sleep(100);
          }

          let rejected = false;
          let retries = 0;
          do {
            try {
              await new Promise((resolve, reject) => {
                pm2.sendDataToProcessId(message.data.id, {
                  id: message.data.id,
                  data: {
                    id: INSTANCE_ID,
                    totalShards: TOTAL_SHARDS,
                  },
                  topic: "setTotalShards",
                }, function (err, result) {
                  if (err) reject(err);
                  rejected = false;
                  resolve(result);
                });
              });
            } catch {
              rejected = true;
              retries++;
              await sleep(100);
            }
          } while (rejected && retries < 5);
        }
      });

      fetchRecommendedShardCount(env.DISCORD_TOKEN!)
        .then(totalShards => {
          if (totalShards < processes.length) {
            totalShards = processes.length;
          }

          sharding.totalShards = TOTAL_SHARDS = totalShards;

          calculateShards();

          sharding.spawn({ timeout: 60_000 });
        });
    }
  });
}
