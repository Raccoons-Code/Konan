const { UserContextMenu } = require('../../classes');
const { codeBlock, inlineCode, time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = class extends UserContextMenu {
  constructor(...args) {
    super(...args);
    this.data = this.setName('User info')
      .setType(2);
  }

  async execute(interaction = this.UserContextMenuInteraction) {
    const { locale, options } = interaction;

    const user = options.getUser('user');
    const member = options.getMember('user');

    const { createdAt, id, tag } = user;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setDescription(`${user}`)
      .setFields(
        { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline: true },
        { name: this.t('discordId', { locale }), value: inlineCode(id), inline: true },
      )
      .setFooter({ text: this.t(member ? 'joinedTheServerAt' : 'creationDate', { locale }) })
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp(member?.joinedTimestamp || createdAt)];

    if (member) {
      const { avatar, displayColor, permissions, roles } = member;

      const textRoles = roles.cache.map(role => role).join(' ').replace('@everyone', '') || '-';
      const perms = permissions.toArray();
      const arrayPerms = perms.map((permission) => this.t('PERMISSION', { locale, PERMISSIONS: [permission] }));
      const textPerms = `${arrayPerms.join(', ')}.`;

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: this.t('roles', { locale }), value: textRoles },
        { name: this.t('permissions', { locale }), value: codeBlock('md', textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(member.displayAvatarURL());
    }

    interaction.reply({ ephemeral: true, embeds });
  }
};