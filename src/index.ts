import { ShardingManager } from 'discord.js';
import 'dotenv/config';
import { join } from 'path';
import { ShardingClient } from 'statcord.js';

const { env, execArgv } = process;
const { STATCORD_KEY } = env;

const manager = new ShardingManager(join(__dirname, 'bot.ts'), { execArgv });

if (STATCORD_KEY) {
  const statcord = new ShardingClient({
    key: STATCORD_KEY,
    manager,
  });

  statcord.on('autopost-start', () => console.log('Statcord autopost started.'));

  statcord.on('post', (status) => {
    if (status) return console.error('Statcord post failed:', status);
  });
}

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();