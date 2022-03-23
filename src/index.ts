import { ShardingManager } from 'discord.js';
import 'dotenv/config';
import { join } from 'path';

const manager = new ShardingManager(join(__dirname, 'bot.ts'), { execArgv: process.execArgv });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();