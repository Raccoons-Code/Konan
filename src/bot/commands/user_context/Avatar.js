const { UserContextMenu } = require('../../structures');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = class extends UserContextMenu {
	constructor(client) {
		super(client);
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
			.setImage(member?.displayAvatarURL({ dynamic: true, size: 512 }) ||
				user.displayAvatarURL({ dynamic: true, size: 512 }))];

		const button = new MessageButton()
			.setStyle('LINK')
			.setLabel('Link')
			.setEmoji('🖼')
			.setURL(member?.displayAvatarURL({ dynamic: true, size: 4096 }) ||
				user.displayAvatarURL({ dynamic: true, size: 4096 }));

		const components = [new MessageActionRow().setComponents(button)];

		await interaction.reply({ components, embeds });
	}
};