const { Client, ClientOptions } = require('discord.js');
const { DiscordTogether } = require('discord-together');
const { prisma } = require('../database');
const commands = require('../commands');
const events = require('../events');
const methods = require('../methods');
const translator = require('../translator');

module.exports = class extends Client {
	/** @param {ClientOptions} [options] */
	constructor(options = {}) {
		super({
			allowedMentions: { parse: ['users'] },
			failIfNotExists: false,
			intents: events.intents,
			partials: events.partials,
			...options,
		});
		this.prisma = prisma;
		this.t = translator.t;
		this.util = methods;
		this.ready = true;
	}

	async login(token = this.token) {
		process.on('unhandledRejection', console.error);
		commands.init(this);
		events.init(this);
		this.commands = commands.commands;
		events.loadEvents();
		return await super.login(token);
	}

	/** @param {ClientOptions} [options] */
	static async login(options) {
		if (!options) options = {};
		if (options.token) this.token = options.token & delete options.token;

		const client = new this(options);
		return await client.login(this.token);
	}
};