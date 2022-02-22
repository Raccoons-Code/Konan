const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');

module.exports = class extends SlashCommand {
	constructor(client) {
		super(client);
		this.data = this.setName('ping')
			.setDescription('Replies with Pong!');
		this._ping = Infinity;
		this.ping_ = -Infinity;
	}

	async execute(interaction = this.CommandInteraction) {
		await interaction.reply({ content: 'Pong!', fetchReply: true }).then(async sent => {
			const { client } = interaction;

			const ping = sent.createdTimestamp - interaction.createdTimestamp;

			if (this._ping > ping) this._ping = ping;
			if (this.ping_ < ping) this.ping_ = ping;

			const embeds = [new MessageEmbed().setColor('RANDOM')
				.setFields([
					{ name: 'API', value: `\`${client.ws.ping}\`ms` },
					{ name: 'Smaller', value: `\`${this._ping}\`ms`, inline: true },
					{ name: 'BOT', value: `\`${ping}\`ms`, inline: true },
					{ name: 'Bigger', value: `\`${this.ping_}\`ms`, inline: true }])];

			await interaction.editReply({ embeds });

			console.log(`Ping: ${ping}ms, Smaller: ${this._ping}ms, Bigger: ${this.ping_}ms`);
		});
	}
};