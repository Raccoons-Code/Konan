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
		this._ping = Infinity;
		this.ping_ = 0;
	}

	/** @param {CommandInteraction} interaction */
	async execute(interaction) {
		interaction.reply({ content: 'Pong!', fetchReply: true }).then(sent => {
			const { client } = interaction;

			const ping = sent.createdTimestamp - interaction.createdTimestamp;

			this._ping = this._ping > ping ? ping : this._ping;

			this.ping_ = this.ping_ < ping ? ping : this._ping;

			interaction.editReply(`Pong! \`API: ${client.ws.ping}ms\`, \`BOT: ${ping}ms\` | \`smaller: ${this._ping}ms\`, \`sigger: ${this.ping_}ms\``);

			console.log(`Ping: ${ping}ms, Smaller: ${this._ping}ms, Bigger: ${this.ping_}ms`);
		});
	}
};