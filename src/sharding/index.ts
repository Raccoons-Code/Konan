import { ShardingManager } from "discord.js";
import { join } from "node:path";
import { execArgv } from "node:process";
import { FILE_EXT } from "../util/constants";

const sharding = new ShardingManager(join(__dirname, `shard${FILE_EXT}`), {
  execArgv,
});

export default sharding;

sharding.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

sharding.spawn({ timeout: 60_000 });
