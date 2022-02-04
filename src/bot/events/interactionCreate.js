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
		const { locale, targetType, componentType } = interaction;

		const command = this[targetType || componentType || 'CHAT_INPUT']?.(interaction);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			this.client.sendError(error);
			try {
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

	// if (!/^(?:\{)(?:(?:("\w+":("\w+"|\d+|\[.*\]|\{.*\}))(?:,|\}$))+)$/.test(customId)) return;
	BUTTON({ client, customId } = this.ButtonInteraction) {
		const { command } = this.util.parseJSON(customId);
		return client.commands.button_component.get(command);
	}

	CHAT_INPUT({ client, commandName } = this.CommandInteraction) {
		return client.commands.slash_interaction.get(commandName);
	}

	MESSAGE({ client, commandName } = this.MessageContextMenuInteraction) {
		return client.commands.message_context.get(commandName);
	}

	SELECT_MENU({ client, customId } = this.SelectMenuInteraction) {
		const { command } = this.util.parseJSON(customId);
		return client.commands.selectmenu_component.get(command);
	}

	USER({ client, commandName } = this.UserContextMenuInteraction) {
		return client.commands.user_context.get(commandName);
	}
};