if (!process.env.DISCORD_TOKEN)
  require('dotenv').config();

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`${__dirname}/bot.js`);

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();