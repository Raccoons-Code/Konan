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

  statcord.on('autopost-start', () => console.log('Started Statcord autopost'));

  statcord.on('post', (status) => {
    if (status) return console.error(status);

    console.log('Successful Statcord post.');
  });
}

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();