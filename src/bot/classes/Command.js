const { Message, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
	/**
	 * @param {Client} client
	 * @param {Data} data
	 */
	constructor(client, data) {
		if (!this.regexCommandName(data.name))
			return console.error(`Command ${data.name} cannot be loaded.`);

		this.data = data;
		if (client?.ready) {
			this.client = client;
			this.prisma = client.prisma;
			this.regexp = client.util.regexp;
      this.t = client.translator.t;
			this.util = client.util;
		}
	}

	async execute() {
		/** @type {Message} */
		this.Message;
	}

	/**
	 * @description delete one message with async timeout delay
	 * @param {Seconds<Number>} timeout
	 * @async
	 */
	async timeout_erase(message, timeout = 0) {
		if (!message) return console.error('Unable to delete undefined message.');
		await this.util.waitAsync(timeout * 1000);
		return await message.delete().catch(() => null);
	}

	/**
	 * @param {String} string
	 * @return {Boolean}
	 */
	regexCommandName(string) {
		return /^[\w-]{1,32}$/.test(string);
	}
};

/**
 * @typedef Data
 * @property {string[]} [aliases]
 * @property {any} [args]
 * @property {PermissionString[]} [clientPermissions]
 * @property {String} description
 * @property {String} [emoji]
 * @property {String} name
 * @property {PermissionString[]} [userPermissions]
 */