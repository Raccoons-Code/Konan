const { ClientEvents, IntentsString, PartialTypes, PermissionString } = require('discord.js');
const Client = require('./client');

module.exports = class {
	/**
	 * @param {Client} client
	 * @param {object} data
	 * @param {Array<IntentsString>} [data.intents]
	 * @param {keyof({on,once})} [data.listener]
	 * @param {keyof(ClientEvents)} data.name
	 * @param {Array<PartialTypes>} [data.partials]
	 * @param {Array<PermissionString>} [data.permissions]
	 */
	constructor(client, {
		intents,
		listener,
		name,
		partials,
		permissions,
	}) {
		this.intents = intents;
		this.listener = listener?.match(/(on(?:ce)?)/)[1] || 'on';
		this.name = name;
		this.partials = partials;
		this.permissions = permissions;
		if (client?.ready) {
			this.client = client;
			this.prisma = client.prisma;
			this.t = client.t;
			this.util = client.util;
		}
	}
};