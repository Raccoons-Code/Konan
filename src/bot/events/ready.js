const { Client, Event } = require('../classes');
const { Permissions } = require('discord.js');
const Commands = require('../commands');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			listener: 'once',
			name: 'ready',
		});
		this.deploySettings = {
			activate: false,
			global: false,
			reset: false,
		};
	}

	get GUILD_ID() {
		return process.env.GUILD_ID?.split(',') || [];
	}

	/** @param {Client} client */
	async execute(client) {
		client.invite = client.generateInvite({
			scopes: ['applications.commands', 'bot'],
			permissions: [Permissions.ALL],
		});

		console.log(`Ready! ${client.user.tag} is on ${client.guilds.cache.size} servers.`);

		this.deployCommands();
		this.deleteMyGuilds();
	}

	async deployCommands({ activate = false, global = false, reset = false } = this.deploySettings) {
		if (!activate) return;

		const data = [];
		const commands = [];
		const { applicationCommands } = new Commands();

		Object.values(applicationCommands).forEach(e => commands.push(e.toJSON()));

		commands.flat().forEach(e => data.push(e.data.toJSON()));

		try {
			if (global) {
				if (reset) {
					this.client.application.commands.set([]);
				} else {
					this.client.application.commands.set(data);
				}
			} else {
				this.GUILD_ID.forEach(v => {
					if (reset) {
						this.client.guilds.fetch(v).then(guild => guild.commands.set([]));
					} else {
						this.client.guilds.fetch(v).then(guild => guild.commands.set(data));
					}
				});
			}

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	}

	async deleteMyGuilds(client = this.client) {
		const guilds = client.guilds.cache.filter(g => g.ownerId === this.client.user.id);

		const users = await this.prisma.user.findMany({ where: { newGuild: { not: null } } });

		let multiplier = 0;

		for (const [, guild] of guilds) {
			const timeout = 60000 - (Date.now() - guild.createdTimestamp);

			multiplier++;

			setTimeout(async () => {
				const user = users.filter(_user => _user.newGuild == guild.id)[0];

				if (!user) return;

				const member = guild.members.resolve(user.id) ||
					guild.members.cache.get(user.id) ||
					await guild.members.fetch(user.id);

				if (member) {
					await guild.setOwner(user.id);

					return await guild.leave();
				}

				await guild.delete().then(async () => {
					console.log(guild.name, 'deleted!');

					await this.prisma.user.update({
						where: { id: user.id },
						data: { newGuild: null, oldGuild: null },
					});
				}).catch(() => null);

			}, ((timeout < 0 ? 0 : timeout) + (multiplier * 1000)));
		}
	}
};