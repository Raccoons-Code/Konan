const { Event } = require('../classes');
const { codeBlock } = require('@discordjs/builders');
const { AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageContextMenuInteraction, MessageEmbed, SelectMenuInteraction, UserContextMenuInteraction } = require('discord.js');
const { env: { GUILD_INVITE } } = process;

module.exports = class extends Event {
	constructor(client) {
		super(client, {
			intents: ['GUILDS'],
			name: 'interactionCreate',
		});
	}

	/** @param {AutocompleteInteraction|ButtonInteraction|CommandInteraction|MessageContextMenuInteraction|SelectMenuInteraction|UserContextMenuInteraction} interaction */
	async execute(interaction) {
		const { client, locale, targetType, componentType } = interaction;

		const command = await this[targetType || componentType || 'CHAT_INPUT']?.(interaction);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			client.sendError(error);

			const embeds = [new MessageEmbed().setColor('DARK_RED')
				.setTitle(this.t('There was an error while executing this command!', { locale }))
				.setDescription(codeBlock('properties', `${error.name}: ${error.message}`))
				.setFooter({ text: command.data?.name || '-' })
				.setTimestamp(Date.now())];

			const components = [];

			if (GUILD_INVITE)
				components.push(new MessageActionRow().setComponents(new MessageButton().setStyle('LINK')
					.setLabel(this.t('supportServer', { locale }))
					.setURL(`${client.options.http.invite}/${GUILD_INVITE}`)));

			const ephemeral = true;

			try {
				if (!interaction.isAutocomplete()) {
					if (interaction.replied) {
						await interaction.editReply({ components, embeds, ephemeral });
					} else {
						await interaction.reply({ components, embeds, ephemeral });
					}
				}
			} catch { null; }
		}
	}

	// if (!/^(?:\{)(?:(?:("\w+":("\w+"|\d+|\[.*\]|\{.*\}))(?:,|\}$))+)$/.test(customId)) return;
	BUTTON({ client, customId } = this.ButtonInteraction) {
		const { c, command } = this.util.parseJSON(customId);
		return client.commands.button_component.get(c || command);
	}

	CHAT_INPUT({ client, commandName } = this.CommandInteraction) {
		return client.commands.slash_interaction.get(commandName);
	}

	MESSAGE({ client, commandName } = this.MessageContextMenuInteraction) {
		return client.commands.message_context.get(commandName);
	}

	SELECT_MENU({ client, customId } = this.SelectMenuInteraction) {
		const { c, command } = this.util.parseJSON(customId);
		return client.commands.selectmenu_component.get(c || command);
	}

	USER({ client, commandName } = this.UserContextMenuInteraction) {
		return client.commands.user_context.get(commandName);
	}
};