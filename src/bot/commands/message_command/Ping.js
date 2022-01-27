const { Command } = require('../../classes');
const { Message } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['p'],
			description: 'Replies with Pong!',
		});
	}

	/** @param {Message} message */
	async execute(message) {
		message.reply('Pong!').then(sent => {
			this.msg_del_time_async(message);
			const ping = sent.createdTimestamp - message.createdTimestamp;
			sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);
			console.log(`Ping: ${ping}ms`);
		});
	}
};