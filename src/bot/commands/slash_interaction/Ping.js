const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
	constructor(client) {
		super();
		this.client = client;
		this.data = this.setName('ping')
			.setDescription('Replies with Pong!');
	}

	/** @param {CommandInteraction} interaction */
	async execute(interaction) {
		interaction.reply({ content: 'Pong!', fetchReply: true }).then(sent => {
			const ping = sent.createdTimestamp - interaction.createdTimestamp;
			interaction.editReply(`Pong! \`API: ${interaction.client.ws.ping}ms\`, \`BOT: ${ping}ms\``);
			console.log(`${ping}ms`);
		});
	}
};