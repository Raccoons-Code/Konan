const { Command } = require('../../structures');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['p'],
			description: 'Replies with Pong!',
		});
	}

	async execute(message = this.Message) {
		const sent = await message.reply('Pong!');

		const ping = sent.createdTimestamp - message.createdTimestamp;

		await sent.edit(`Pong! \`API: ${message.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);

		console.log(`Ping: ${ping}ms`);
	}
};