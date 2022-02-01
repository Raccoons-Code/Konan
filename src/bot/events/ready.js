const { Event } = require('../classes');
const { Permissions } = require('discord.js');
const { env: { GUILD_ID } } = process;

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			listener: 'once',
			name: 'ready',
		});

		this.GUILD_ID = GUILD_ID?.split(',') || [];
	}

	async execute(client = this.client) {
		client.invite = client.generateInvite({
			scopes: ['applications.commands', 'bot'],
			permissions: [Permissions.ALL],
		});

		console.log(`Ready! ${client.user.tag} is on ${client.guilds.cache.size} servers.`);

		this.deleteMyGuilds(client);
	}

	async deleteMyGuilds(client = this.client) {
		const guilds = client.guilds.cache.filter(g => g.ownerId === client.user.id);

		const users = await this.prisma.user.findMany({ where: { newGuild: { not: null } } });

		let multiplier = 0;

		for (const [, guild] of guilds) {
			const timeout = 60000 - (Date.now() - guild.createdTimestamp);

			multiplier++;

			setTimeout(async () => {
				const user = users.find(_user => _user.newGuild == guild.id);

				if (user) {
					const member = guild.members.resolve(user.id) ||
						await guild.members.fetch(user.id);

					if (member) {
						await guild.setOwner(user.id);

						return await guild.leave();
					}
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