const { Event } = require('../classes');
const { Permissions } = require('discord.js');
const Backup = require('discord-backup');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			listener: 'once',
			name: 'ready',
		});
	}

	async execute(client = this.client) {
		client.invite = client.generateInvite({
			scopes: ['applications.commands', 'bot'],
			permissions: [Permissions.ALL],
		});

		console.log(`Ready! ${client.user.tag} is on ${client.guilds.cache.size} servers.`);

		this.deleteMyGuilds(client);
		this.setPresence(client);
	}

	async deleteMyGuilds(client = this.client) {
		const guilds = client.guilds.cache.filter(g => g.ownerId === client.user.id);

		const users = await this.prisma.user.findMany({
			where: { newGuild: { not: null } },
			include: { backups: true },
		});

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
						const backup = user.backups.find(b => b.userId === user.id);

						if (backup)
							await Backup.load(backup.data, guild,
								{ clearGuildBeforeRestore: true, maxMessagesPerChannel: backup.premium ? 50 : 0 });

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

	async setPresence(client = this.client) {
		const { channels, user, guilds, users } = client;
		const ytURL = 'https://www.youtube.com/watch?v=';

		user.setPresence({
			activities: [
				{ name: `${users.cache.size} users`, type: 'WATCHING' },
				{ name: 'Cat Vibing Meme', type: 'STREAMING', url: `${ytURL}NUYvbT6vTPs` },
				{ name: `${guilds.cache.size} servers`, type: 'PLAYING' },
				{ name: 'Wide Putin Walking', type: 'STREAMING', url: `${ytURL}SLU3oG_ePhM` },
				{ name: `${channels.cache.size} channels`, type: 'LISTENING' },
				{ name: 'Noisestorm - Crab Rave', type: 'STREAMING', url: `${ytURL}LDU_Txk06tM` },
				{ name: 'National Anthem of USSR', type: 'STREAMING', url: `${ytURL}U06jlgpMtQs` },
				{ name: 'Rick Astley - Never Gonna Give You Up', type: 'STREAMING', url: `${ytURL}dQw4w9WgXcQ` },
			],
		});

		await this.util.waitAsync(10000);
		this.setPresence(client);
	}
};