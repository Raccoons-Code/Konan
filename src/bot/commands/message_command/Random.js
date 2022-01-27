const { Command } = require('../../classes');
const { Message } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'random',
      description: 'Replies with random imagens.',
      args: ['cat'],
      permissions: ['ATTACH_FILES'],
    });
  }

  /** @param {Message} message */
  async execute(message) {
    this.msg_del_time_async(message);

    this.message = message;

    const { args, guild } = message;

    const locale = guild?.preferredLocale;

    if (!args?.length || !this.data.args.includes(args[0]))
      return this.msg_del_time_async(await message.reply(`${this.t('Expected arguments:', { locale })} ${this.data.args}`), 10);

    this[args[0]]?.(await message.reply(`${this.t('Fetching a random {{args[0]}}', { locale, args })}...`));
  }

  async cat(message = this.message) {
    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    this.msg_del_time_async(await message.edit({ content: null, files: [file] }), 6000);
  }
};