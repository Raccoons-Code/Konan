const { Event } = require('../classes');
const { Message } = require('discord.js');
const { env: { TEAM } } = process;

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
			name: 'messageCreate',
			partials: ['CHANNEL', 'MESSAGE'],
		});
	}

	/** @param {Message} message */
	async execute(message) {
		const { author, channel, client, content, guild } = message;

		if (author.bot && !TEAM?.split(',').includes(author.id)) return;

		const { commands, commandTypes, user } = client;
		const botRole = guild?.me.roles.botRole || user.id;
		const regexp = RegExp(`^\\s*(?:<@!?&?(?:${user.id}|${botRole.id})>)(.*)$`);
		const matched = content.match(regexp);

		if (!matched) return;

		message.args = matched[1]?.trim().split(/\s+/g);
		const commandName = message.commandName = message.args?.shift().toLowerCase() || 'help';

		const command = commands[commandTypes.command.filter(v => commands[v].has(commandName))[0]]?.get(commandName);

		if (!command) return;

		if (!/(backup)/i.test(commandName))
			await channel.sendTyping();

		try {
			await command.execute(message);
		} catch (error) {
			console.error(error, command.data?.name);
		}
	}
};