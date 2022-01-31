const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
	constructor(...args) {
		super(...args);
		this.data = this.setName('ping')
			.setDescription('Replies with Pong!');
		this._ping = Infinity;
		this.ping_ = 0;
	}

	async execute(interaction = this.CommandInteraction) {
		interaction.reply({ content: 'Pong!', fetchReply: true }).then(sent => {
			const { client } = interaction;

			const ping = sent.createdTimestamp - interaction.createdTimestamp;

			this._ping > ping ? this._ping = ping : null;

			this.ping_ < ping ? this.ping_ = ping : null;

			interaction.editReply(`Pong! \`API: ${client.ws.ping}ms\`, \`BOT: ${ping}ms\` | \`smaller: ${this._ping}ms\`, \`bigger: ${this.ping_}ms\``);

			console.log(`Ping: ${ping}ms, Smaller: ${this._ping}ms, Bigger: ${this.ping_}ms`);
		});
	}
};