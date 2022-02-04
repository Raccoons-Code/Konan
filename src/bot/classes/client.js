const { Client, ClientOptions, MessageEmbed } = require('discord.js');
const { prisma } = require('../database');
const commands = require('../commands');
const events = require('../events');
const methods = require('../methods');
const translator = require('../translator');
const { env: { GUILD_ID, ERROR_CHANNEL } } = process;

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
		process.on('unhandledRejection', (reason, promise) => this.sendError(reason));
		commands.init(this);
		events.init(this);
		this.commands = commands.commands;
		events.loadEvents();
		return await super.login(token);
	}

	static async login(token = this.token) {
		const client = new this();
		return await client.login(token);
	}

	async sendError(reason = Error()) {
		if (!GUILD_ID || !ERROR_CHANNEL || !this.isReady()) return console.error(reason);

		const guildId = GUILD_ID.split(',')[0];
		const channelId = ERROR_CHANNEL.split(',')[0];

		const guild = this.clientGuild ? this.clientGuild :
			this.clientGuild = this.guilds.resolve(guildId) || await this.guilds.fetch(guildId);

		if (!guild) return console.error(reason);

		const channel = this.clientChannel ? this.clientChannel :
			this.clientChannel = guild.channels.resolve(channelId) || await guild.channels.fetch(channelId);

		if (!channel || !channel.viewable) return console.error(reason);

		const embeds = [new MessageEmbed().setColor('RED')
			.setTitle(`${reason.name}: ${reason.message}`)
			.setDescription(`\`\`\`${reason.stack}\`\`\``)];

		channel.send({ embeds }).catch(() => console.error(reason));
	}
};