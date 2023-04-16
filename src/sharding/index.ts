import { Collection, Shard, ShardingManager } from "discord.js";
import { join } from "node:path";
import { execArgv } from "node:process";
import { FILE_EXT } from "../util/constants";

const sharding = new ShardingManager(join(__dirname, `shard${FILE_EXT}`), {
  execArgv: execArgv.concat("--trace-warnings"),
});

export default sharding;

export const shards = new Collection<number, Shard>();

import "./events";
