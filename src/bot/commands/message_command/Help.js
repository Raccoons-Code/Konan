const { Command } = require('../../classes');
const { Message, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      aliases: ['h'],
      description: 'Help!',
      permissions: ['EMBED_LINKS'],
    });
  }

  /** @param {Message} message */
  async execute(message) {
    this.message = message;
    this.msg_del_time_async(message);

    const { client } = message;

    const invite_button = new MessageButton()
      .setLabel('Invite-me')
      .setStyle('LINK')
      .setURL(client.invite);

    const components = [new MessageActionRow()
      .setComponents([invite_button])];

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setDescription('Hi!')];

    this.msg_del_time_async(await message.reply({ embeds, components }), 60);
  }
};