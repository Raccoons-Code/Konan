const { UserContextMenu } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = class extends UserContextMenu {
	constructor(...args) {
		super(...args);
		this.data = this.setName('Get avatar')
			.setType(2);
	}

	async execute(interaction = this.UserContextMenuInteraction) {
		const user = interaction.options.getUser('user');

		const buttons = [new MessageButton()
			.setStyle('LINK')
			.setLabel('Link')
			.setEmoji('🖼')
			.setURL(user.avatarURL({ dynamic: true, format: 'png', size: 4096 }))];

		const components = [new MessageActionRow().setComponents(buttons)];

		const embeds = [new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`${user}`)
			.setImage(user.avatarURL({ dynamic: true, format: 'png', size: 512 }))];

		interaction.reply({ components, embeds });
	}
};