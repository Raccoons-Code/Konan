require('dotenv').config();

const { ShardingManager } = require('discord.js');
const	manager = new ShardingManager(`${__dirname}/bot/index.js`);

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();