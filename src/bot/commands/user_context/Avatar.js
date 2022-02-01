const { UserContextMenu } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = class extends UserContextMenu {
	constructor(...args) {
		super(...args);
		this.data = this.setName('Get avatar')
			.setType(2);
	}

	async execute(interaction = this.UserContextMenuInteraction) {
		const { options } = interaction;

		const user = options.getUser('user');
		const member = options.getMember('user');

		const embeds = [new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(`${user}`)
			.setImage(member?.displayAvatarURL({ dynamic: true, format: 'png', size: 512 }) ||
				user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 }))];

		const button = new MessageButton()
			.setStyle('LINK')
			.setLabel('Link')
			.setEmoji('🖼')
			.setURL(member?.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }) ||
				user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }));

		const components = [new MessageActionRow().setComponents(button)];

		interaction.reply({ components, embeds });
	}
};