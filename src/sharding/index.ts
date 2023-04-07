import { ShardingManager } from "discord.js";
import { join } from "node:path";
import { env, execArgv } from "node:process";
import TopggShardingAutoposter from "../modules/Topgg/shardingAutoposter";
import { FILE_EXT } from "../util/constants";

const sharding = new ShardingManager(join(__dirname, `shard${FILE_EXT}`), {
  execArgv,
});

export default sharding;

const topggShardingAutoposter = new TopggShardingAutoposter();

sharding.on("shardCreate", async function (shard) {
  if (env.PM2_INSTANCE_ID) {
    console.log(`Launched cluster ${env.PM2_INSTANCE_ID} shard ${shard.id}`);
  } else {
    console.log(`Launched shard ${shard.id}`);
  }

  shard.once("ready", async function () {
    if (sharding.shards.size === sharding.totalShards) {
      if (!topggShardingAutoposter.started)
        topggShardingAutoposter.start();
    }
  });
});
