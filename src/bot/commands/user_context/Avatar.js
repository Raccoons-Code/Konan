const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, UserContextMenuInteraction } = require('discord.js');

module.exports = class extends ContextMenuCommandBuilder {
	constructor(client) {
		super();
		this.client = client;
		this.data = this.setName('Get avatar')
			.setType(2);
	}

	/** @param {UserContextMenuInteraction} interaction */
	async execute(interaction) {
		this.interaction = interaction;
		const { user } = interaction.guild.members.resolve(interaction.targetId);

		const mButton = new MessageButton()
			.setLabel('Link')
			.setStyle('LINK')
			.setEmoji('🖼')
			.setURL(user.avatarURL({ dynamic: true, format: 'png', size: 4096 }));

		const mRow = new MessageActionRow()
			.setComponents(mButton);

		const mEmbed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`${user}`)
			.setImage(user.avatarURL({ dynamic: true, format: 'png', size: 512 }));

		interaction.reply({ components: [mRow], embeds: [mEmbed] });
	}
};