const { Command } = require('../../classes');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { env: { GUILD_INVITE } } = process;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      aliases: ['h'],
      description: 'Help!',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async execute(message = this.Message) {
    this.timeout_erase(message);

    const { author: user, client, guild } = message;

    const locale = guild?.preferredLocale;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setTitle(this.t('Konan\'s support', { locale }))
      .setThumbnail(guild?.me.displayAvatarURL() || client.user.displayAvatarURL())
      .setDescription(this.t('help text', { locale, user }))];

    const buttons = [new MessageButton().setStyle('LINK')
      .setLabel(this.t('Invite Link', { locale }))
      .setURL(client.invite),
    new MessageButton().setStyle('LINK')
      .setLabel(this.t('Server for support', { locale }))
      .setURL(`${client.options.http.invite}/${GUILD_INVITE}`)];

    const components = [new MessageActionRow().setComponents(buttons)];

    this.timeout_erase(await message.reply({ components, embeds }), 60);
  }
};