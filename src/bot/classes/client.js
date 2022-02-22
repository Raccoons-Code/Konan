const { Client, ClientOptions, MessageEmbed, WebhookClient } = require('discord.js');
const { prisma } = require('../database');
const commands = require('../commands');
const events = require('../events');
const methods = require('../methods');
const translator = require('../translator');
const { env: { DONATE_LINK, ERROR_WEBHOOK, PAYPAL_DONATE_LINK } } = process;

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
		this.translator = translator;
		this.util = methods;
	}

	get donate() {
		return {
			url: DONATE_LINK,
			paypal: PAYPAL_DONATE_LINK,
		};
	}

	async login(token = this.token) {
		process.on('unhandledRejection', (...args) => this.sendError(...args));
		this.ready = true;
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
		if (!ERROR_WEBHOOK || !this.isReady()) return console.error(reason);

		const webhook = new WebhookClient({ url: ERROR_WEBHOOK });

		if (!webhook) return console.error(reason);

		const embeds = [new MessageEmbed().setColor('RED')
			.setTitle(`${reason.name}: ${reason.message}`)
			.setDescription(`\`\`\`${reason.stack}\`\`\``)];

		await webhook.send({
			embeds,
			avatarURL: this.user.displayAvatarURL(),
			username: this.user.username,
		}).catch(() => console.error(reason));
	}

	async fetchStats() {
		return await Promise.all([
			this.shard.fetchClientValues('guilds.cache.size'),
			this.shard.fetchClientValues('channels.cache.size'),
			this.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		]).then(results => {
			this.totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
			this.totalChannels = results[1].reduce((acc, channelsCount) => acc + channelsCount, 0);
			this.totalMembers = results[2].reduce((acc, memberCount) => acc + memberCount, 0);
		}).catch(console.error);
	}

	async topggautoposter() {
		require('../topgg').AutoPoster?.(this);
	}
};