const { SlashCommand } = require('../../structures');
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
		const sent = await interaction.reply({ content: 'Pong!', ephemeral: true, fetchReply: true });

		const ping = sent.createdTimestamp - interaction.createdTimestamp;

		if (this._ping > ping) this._ping = ping;
		if (this.ping_ < ping) this.ping_ = ping;

		const embeds = [new MessageEmbed().setColor('RANDOM')
			.setFields([
				{ name: ':signal_strength:', value: `**\`${interaction.client.ws.ping}\`ms**` },
				{ name: ':heavy_minus_sign:', value: `**\`${this._ping}\`ms**`, inline: true },
				{ name: ':robot:', value: `**\`${ping}\`ms**`, inline: true },
				{ name: ':heavy_plus_sign:', value: `**\`${this.ping_}\`ms**`, inline: true },
			])];

		await interaction.editReply({ embeds });

		console.log(`Ping: ${ping}ms`);
	}
};