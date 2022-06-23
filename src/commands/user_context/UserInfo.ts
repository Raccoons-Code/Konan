import { codeBlock, ContextMenuCommandBuilder, inlineCode, time } from '@discordjs/builders';
import { Client, MessageEmbed, UserContextMenuInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

export default class UserInfo extends UserContextMenu {
  constructor(client: Client) {
    super(client);

    this.data = new ContextMenuCommandBuilder().setName('User info')
      .setType(2);
  }

  async execute(interaction: UserContextMenuInteraction<'cached'>) {
    const { locale, targetMember, targetUser } = interaction;

    const { createdAt, id, tag } = targetUser;

    const embeds = [
      new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`${targetUser}`)
        .setFields(
          { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline: true },
          { name: this.t('discordId', { locale }), value: inlineCode(id), inline: true },
        )
        .setFooter({ text: this.t(targetMember ? 'joinedTheServerAt' : 'creationDate', { locale }) })
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setTimestamp(targetMember?.joinedTimestamp ?? createdAt),
    ];

    if (targetMember) {
      const { avatar, displayColor, permissions, roles } = targetMember;

      const arrayRoles = roles.cache.map(role => role);
      const textRoles = arrayRoles.join(' ').trim().replace('@everyone', '') || '-';
      const arrayPerms = permissions.toArray();
      const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline: true },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('creationDate', { locale }), value: `${time(createdAt)} ${time(createdAt, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(targetMember.displayAvatarURL({ dynamic: true }));
    }

    return interaction.reply({ embeds, ephemeral: true });
  }
}