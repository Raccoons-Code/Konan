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
			intents: 0,
			partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
			...options,
		});
		this.prisma = prisma;
		this.translator = translator;
		this.t = translator.t;
	}

	async login(token = this.token) {
		process.on('unhandledRejection', console.error);
		this.util = methods;
		commands.init(this);
		events.init(this);
		this.commands = commands.commands;
		this.options.intents = events.intents;
		events.loadEvents();
		return await super.login(token);
	}

	static async login() {
		const client = new this();
		return await client.login();
	}
};