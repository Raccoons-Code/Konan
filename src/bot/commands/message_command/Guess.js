const { Command } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'guess',
			description: 'You have 10 chances to guess the number from 1 to 100 that the bot set.',
			args: Number,
		});
	}

	async execute(message = this.Message) {
		this.timeout_erase(message);

		const { args, author, guild, guildId } = message;

		const locale = guild?.preferredLocale;
		const [arg] = args;
		const number = parseInt(arg);

		const embeds = [new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(this.t('Guess the number.', { locale }))];

		if (!number || number > 100) {
			embeds[0].setDescription(this.t('{{author}}, enter an integer from 1 to 100.', { locale, author }));
			return this.timeout_erase(await message.reply({ embeds }), 10);
		}

		if (!db.has(`${guildId}.${author.id}.guess`))
			db.set(`${guildId}.${author.id}.guess`, { value: this.util.mathRandom(100, 1) });

		const { value, user = [] } = db.get(`${guildId}.${author.id}.guess`);

		if (number === value) {
			embeds[0].setDescription(this.t('{{author}}, {{number}} is correct, congratulations!', { locale, author, number }))
				.addFields({
					name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
					value: `${user?.join(' ') || '-'}`,
				});

			db.delete(`${guildId}.${author.id}.guess`);
			return this.timeout_erase(await message.reply({ embeds }), 10);
		}

		if (this.util.isDuplicate(user, number)) {
			if (number < value)
				embeds[0].setDescription(this.t('{{author}}, you have already tried {{number}}!\n:arrow_down_small: This is minor!', { locale, author, number }));

			if (number > value)
				embeds[0].setDescription(this.t('{{author}}, you have already tried {{number}}!\n:arrow_up_small: This is greater!', { locale, author, number }));

			embeds[0].addFields({
				name: `${this.t('Previous guesses', { locale })} ${user?.length}/10`,
				value: `${user?.join(' ') || '-'}`,
			});
			return this.timeout_erase(await message.reply({ embeds }), 10);
		}

		if (user?.length === 9) {
			embeds[0].setDescription(this.t('{{author}}, {{number}} is incorrect, game over!', { locale, author, number }))
				.addFields({
					name: `${this.t('Previous guesses', { locale })} ${user.length + 1}/10`,
					value: `${user.join(' ')}`,
				});
			db.delete(`${guildId}.${author.id}.guess`);
			return this.timeout_erase(await message.reply({ embeds }), 10);
		}

		if (number < value)
			embeds[0].setDescription(`${this.t('{{author}}, {{number}} is minor!', { locale, author, number })} :arrow_down_small:`)
				.addFields({
					name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
					value: `${user?.join(' ') || '-'}`,
				});

		if (number > value)
			embeds[0].setDescription(`${this.t('{{author}}, {{number}} is greater!', { locale, author, number })} :arrow_up_small:`)
				.addFields({
					name: `${this.t('Previous guesses', { locale })} ${user?.length + 1}/10`,
					value: `${user?.join(' ') || '-'}`,
				});

		user.push(number);
		db.set(`${guildId}.${author.id}.guess.user`, user);
		this.timeout_erase(await message.reply({ embeds }), 10);
	}
};