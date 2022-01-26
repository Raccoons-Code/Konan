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
		this.msg_del_time_async(message);
		message.reply('Pong!').then(sent => {
			const ping = sent.createdTimestamp - message.createdTimestamp;
			sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);
			console.log(`${ping}ms`);
		});
	}
};