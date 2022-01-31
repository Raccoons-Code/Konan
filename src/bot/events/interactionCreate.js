const { Event } = require('../classes');
const { AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageContextMenuInteraction, SelectMenuInteraction, UserContextMenuInteraction } = require('discord.js');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			intents: ['GUILDS'],
			name: 'interactionCreate',
		});
	}

	/** @param {AutocompleteInteraction|ButtonInteraction|CommandInteraction|MessageContextMenuInteraction|SelectMenuInteraction|UserContextMenuInteraction} interaction */
	async execute(interaction) {
		this.interaction = interaction;

		const { locale, targetType, componentType } = interaction;

		const command = this[targetType || 'CHAT_INPUT']?.(interaction);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			try {
				console.error(error, command.data?.name);

				if (!interaction.isAutocomplete() && !interaction.isMessageComponent()) {
					if (interaction.replied) {
						await interaction.editReply({
							content: this.t('There was an error while executing this command!', { locale }),
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: this.t('There was an error while executing this command!', { locale }),
							ephemeral: true,
						});
					}
				}
			} catch { null; }
		}
	}

	CHAT_INPUT({ client, commandName } = this.interaction) {
		return client.commands.slash_interaction.get(commandName);
	}

	MESSAGE({ client, commandName } = this.interaction) {
		return client.commands.message_context.get(commandName);
	}

	USER({ client, commandName } = this.interaction) {
		return client.commands.user_context.get(commandName);
	}
};