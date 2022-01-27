const { Event } = require('../classes');
const { Interaction } = require('discord.js');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			intents: ['GUILDS'],
			name: 'interactionCreate',
		});
	}

	/** @param {Interaction} interaction */
	async execute(interaction) {
		this.interaction = interaction;
		const { locale, targetType } = interaction;

		const command = this[targetType || 'CHAT_INPUT']?.();

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			try {
				await interaction.reply({
					content: this.t('There was an error while executing this command!', { locale }),
					ephemeral: true,
				});
				console.error(error, command.data?.name);
			} catch { null; }
		}
	}

	CHAT_INPUT({ client, commandName } = this.interaction) {
		const { commands } = client;
		return commands.slash_interaction.get(commandName);
	}

	MESSAGE({ client, commandName } = this.interaction) {
		const { commands } = client;
		return commands.message_context.get(commandName);
	}

	USER({ client, commandName } = this.interaction) {
		const { commands } = client;
		return commands.user_context.get(commandName);
	}
};