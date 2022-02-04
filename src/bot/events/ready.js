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

	async deleteGuild(guild, user) {
		await guild.delete().then(async () => {
			console.log(guild.name, 'deleted!');

			if (user)
				await this.prisma.user.update({
					where: { id: user.id },
					data: { newGuild: null, oldGuild: null },
				});
		}).catch(() => null);
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

			const user = users.find(_user => _user.newGuild == guild.id);

			if (!user) return this.deleteGuild(guild);

			let member = guild.members.resolve(user.id) ||
				await guild.members.fetch(user.id);

			if (member)
				return this.restoreGuild(guild, member, user);

			multiplier++;

			setTimeout(async () => {
				member = guild.members.resolve(user.id);

				if (member)
					return this.restoreGuild(guild, member, user);

				this.deleteGuild(guild, user);
			}, ((timeout < 0 ? 0 : timeout) + (multiplier * 1000)));
		}
	}

	async restoreGuild(guild, member, user) {
		const backup = user.backups.find(b => b.userId === user.id);

		if (backup) {
			if (!backup.premium) {
				backup.data.bans = [];
				backup.data.emojis = [];
			}

			await Backup.load(backup.data, guild,
				{ clearGuildBeforeRestore: true, maxMessagesPerChannel: backup.premium ? 20 : 0 });
		}
		const m = backup?.data.channels.categories.reduce((pca, cca) =>
			pca + (cca.children?.reduce((pch, cch) => pch + (cch.messages?.length || 0) || 0), 0), 0) || 0;

		setTimeout(async () => {
			await guild.setOwner(member.id);

			await this.prisma.user.update({ where: { id: member.id }, data: { newGuild: null, oldGuild: null } });

			await guild.leave();
		}, isNaN(m) ? 1000 : m * 1000);
	}

	async setPresence(client = this.client) {
		const { shard, user } = client;
		const ytURL = 'https://www.youtube.com/watch?v=';

		const promises = [
			shard.fetchClientValues('guilds.cache.size'),
			shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
			shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)),
		];

		Promise.all(promises)
			.then(results => {
				this.totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				this.totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				this.totalChannels = results[2].reduce((acc, channelsCount) => acc + channelsCount, 0);
			})
			.catch(console.error);

		user.setPresence({
			activities: [
				{ name: `${this.totalMembers || 'Fetching'} users`, type: 'WATCHING' },
				{ name: 'Cat Vibing Meme', type: 'STREAMING', url: `${ytURL}NUYvbT6vTPs` },
				{ name: `${this.totalGuilds || 'Fetching'} servers`, type: 'PLAYING' },
				{ name: 'Wide Putin Walking', type: 'STREAMING', url: `${ytURL}SLU3oG_ePhM` },
				{ name: `${this.totalChannels || 'Fetching'} channels`, type: 'LISTENING' },
				{ name: 'Noisestorm - Crab Rave', type: 'STREAMING', url: `${ytURL}LDU_Txk06tM` },
				{ name: 'National Anthem of USSR', type: 'STREAMING', url: `${ytURL}U06jlgpMtQs` },
				{ name: 'Rick Astley - Never Gonna Give You Up', type: 'STREAMING', url: `${ytURL}dQw4w9WgXcQ` },
			],
		});

		await this.util.waitAsync(10000 * this.util.mathRandom(6, 1));
		this.setPresence(client);
	}
};