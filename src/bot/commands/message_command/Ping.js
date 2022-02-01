const { Command } = require('../../classes');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['p'],
			description: 'Replies with Pong!',
		});
	}

	async execute(message = this.Message) {
		message.reply('Pong!').then(sent => {
			this.timeout_erase(message);
			const ping = sent.createdTimestamp - message.createdTimestamp;
			sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);
			console.log(`Ping: ${ping}ms`);
		});
	}
};