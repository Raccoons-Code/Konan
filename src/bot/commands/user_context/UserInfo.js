const { UserContextMenu } = require('../../structures');
const { codeBlock, inlineCode, time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = class extends UserContextMenu {
  constructor(client) {
    super(client);
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
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(member?.joinedTimestamp || createdAt)];

    if (member) {
      const { avatar, displayColor, permissions, roles } = member;

      const arrayRoles = roles.cache.map(role => role);
      const textRoles = arrayRoles.join(' ').replace('@everyone', '') || '-';
      const arrayPerms = permissions.toArray();
      const textPerms = arrayPerms.map(p => this.t('PERMISSION', { locale, PERMISSIONS: [p] })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(member.displayAvatarURL({ dynamic: true }));
    }

    await interaction.reply({ ephemeral: true, embeds });
  }
};