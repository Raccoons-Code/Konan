import { ShardingManager } from 'discord.js';
import 'dotenv/config';
import { join } from 'node:path';
import { env, execArgv } from 'node:process';
import { ShardingClient } from 'statcord.js';

const manager = new ShardingManager(join(__dirname, 'bot.ts'), { execArgv });

export { manager };

if (env.STATCORD_KEY) {
  const statcord = new ShardingClient({
    key: env.STATCORD_KEY,
    manager,
  });

  statcord.on('autopost-start', () => console.log('Statcord autopost started.'));

  statcord.on('post', (status) => {
    if (status) return console.error('Statcord post failed:', status);
  });
}

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();