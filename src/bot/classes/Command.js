const { Message, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
	/**
	 * @param {Client} client
	 * @param {object} data
	 * @param {Array} [data.aliases]
	 * @param {any|Array} [data.args]
	 * @param {String|Array|object} [data.args_help]
	 * @param {String} data.description
	 * @param {String} [data.emoji]
	 * @param {String} data.name
	 * @param {Array<PermissionString>} [data.permissions]
	 */
	constructor(client, {
		aliases,
		args,
		args_help,
		description,
		emoji,
		name,
		permissions,
	}) {
		if (!this.regexCommandName(name))
			return console.error(`Command ${name} cannot be loaded.`);

		this.client = client;
		this.data = { aliases, args, args_help, description, emoji, name, permissions };
		this.prisma = client.prisma;
		this.t = client.t;
		this.util = client.util;
	}

	/**
	 * @description run command
	 * @param {Message} message
	 */
	async execute(message) {
		return console.error(message.commandName);
	}

	/**
	 * @description delete one message with async timeout delay
	 * @param {Seconds<Number>} timeout
	 * @async
	 */
	async msg_del_time_async(message, timeout = 0) {
		if (!message) return console.error('Unable to delete undefined message.');
		await this.util.waitAsync(timeout * 1000);
		return await message.delete().catch(() => null);
	}

	/**
	 * @description delete one message with timeout delay
	 * @param {Seconds<Number>} timeout
	 */
	msg_del_time_sync(message, timeout = 0) {
		if (!message) return console.error('Unable to delete undefined message.');
		this.util.waitSync(timeout * 1000);
		return message.delete().catch(() => null);
	}

	/**
	 * @param {String} string
	 * @return {Boolean}
	 */
	regexCommandName(string) {
		return /^[\w-]{1,32}$/.test(string);
	}
};