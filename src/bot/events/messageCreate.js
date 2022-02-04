const { Event } = require('../classes');
const { env: { TEAM } } = process;

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
			name: 'messageCreate',
			partials: ['CHANNEL', 'MESSAGE'],
		});
	}

	async execute(message = this.Message) {
		const { author, channel, client, content, guild } = message;

		if (author.bot && !TEAM?.split(',').includes(author.id)) return;

		const { commands, user } = client;
		const botRole = guild?.me.roles.botRole || user.id;
		const regexp = RegExp(`^\\s*(?:<@!?&?(?:${user.id}|${botRole.id})>)(.*)$`);
		const matched = content.match(regexp);

		if (!matched) return;

		message.args = matched[1].trim().split(/\s+/g);
		const commandName = message.commandName = message.args.shift().toLowerCase() || 'help';

		const command = commands.message_command.get(commandName);

		if (!command) return;

		if (channel.permissionsFor(guild.me).missing(command.data?.clientPermissions).length) return;

		if (!/(backup|deploy|throw)/.test(commandName))
			await channel.sendTyping();

		try {
			await command.execute(message);
		} catch (error) {
			this.client.sendError(error);
		}
	}
};