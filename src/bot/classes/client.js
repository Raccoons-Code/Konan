const { Client, ClientOptions, MessageEmbed } = require('discord.js');
const { prisma } = require('../database');
const commands = require('../commands');
const events = require('../events');
const methods = require('../methods');
const translator = require('../translator');
const { env: { GUILD_ID, ERROR_CHANNEL, DONATE_LINK } } = process;

module.exports = class extends Client {
	/** @param {ClientOptions} [options] */
	constructor(options = {}) {
		super({
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

	get donate() {
		return {
			paypal: DONATE_LINK,
		};
	}

	async login(token = this.token) {
		process.on('unhandledRejection', (...args) => this.sendError(...args));
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

		const guild = this.supportGuild ? this.supportGuild :
			this.supportGuild = this.guilds.resolve(guildId) || await this.guilds.fetch(guildId);

		if (!guild) return console.error(reason);

		const channel = this.supportErrorChannel ? this.supportErrorChannel :
			this.supportErrorChannel = guild.channels.resolve(channelId) || await guild.channels.fetch(channelId);

		if (!channel || !channel.viewable) return console.error(reason);

		const embeds = [new MessageEmbed().setColor('RED')
			.setTitle(`${reason.name}: ${reason.message}`)
			.setDescription(`\`\`\`${reason.stack}\`\`\``)];

		channel.send({ embeds }).catch(() => console.error(reason));
	}

	async fetchStats() {
		const promises = [
			this.shard.fetchClientValues('guilds.cache.size'),
			this.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
			this.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)),
		];

		return await Promise.all(promises)
			.then(results => {
				this.totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				this.totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				this.totalChannels = results[2].reduce((acc, channelsCount) => acc + channelsCount, 0);
			})
			.catch(console.error);
	}
};