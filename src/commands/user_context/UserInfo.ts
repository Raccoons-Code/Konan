import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder, inlineCode, time, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenu } from '../../structures';

const inline = true;

export default class UserInfo extends UserContextMenu {
  constructor() {
    super();

    this.data.setName('User info');
  }

  build() {
    return this.data
      .setType(ApplicationCommandType.User);
  }

  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const { guild, locale, targetMember, targetUser } = interaction;

    const target = targetMember ?? targetUser;

    const { displayName } = target;

    const { accentColor, createdAt, flags, id, tag, username } = targetUser;

    const flagsArray = flags?.toArray();
    const textFlags = flagsArray?.map(flag => this.t(flag, { locale })).join('\n') || '-';

    const embeds = [
      new EmbedBuilder()
        .setColor(accentColor ?? 'Random')
        .setAuthor({ name: displayName ?? username, iconURL: target.displayAvatarURL() })
        .setFields(
          { name: this.t('discordTag', { locale }), value: inlineCode(tag), inline },
          { name: this.t('discordId', { locale }), value: inlineCode(id), inline },
          { name: `Flags [${flagsArray?.length ?? 0}]`, value: codeBlock(textFlags) },
          { name: this.t('creationDate', { locale }), value: `${time(createdAt)}${time(createdAt, 'R')}`, inline },
        )
        .setThumbnail(target.displayAvatarURL()),
    ];

    if (targetMember) {
      const { avatar, displayColor, joinedAt, permissions, roles } = targetMember;

      const arrayRoles = roles.cache.toJSON();
      const textRoles = arrayRoles.join(' ').replace('@everyone', '').trim() || '-';
      const arrayPerms = permissions.toArray();
      const textPerms = arrayPerms.map(p => this.t(p, { locale })).join(', ') || '-';

      embeds[0].addFields(
        { name: this.t('role', { locale }), value: `${roles.highest}`, inline },
        { name: `${this.t('roles', { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        { name: `${this.t('permissions', { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
        { name: this.t('joinedTheServerAt', { locale }), value: `${time(joinedAt!)}${time(joinedAt!, 'R')}` });

      if (roles.color)
        embeds[0].setColor(displayColor);

      if (avatar)
        embeds[0].setThumbnail(targetMember.displayAvatarURL());
    }

    const components = [];

    const integrations = await guild.fetchIntegrations();

    const integration = integrations.find(i => i.application?.id === targetUser.id);

    if (integration) {
      const { application } = integration;

      if (application) {
        const { description, privacyPolicyURL, termsOfServiceURL } = application;

        if (description)
          embeds[0].setDescription(description);

        if (privacyPolicyURL || termsOfServiceURL)
          components.push(new ActionRowBuilder<ButtonBuilder>());

        if (privacyPolicyURL)
          components[0]
            .addComponents(new ButtonBuilder()
              .setLabel('Privacy policy')
              .setStyle(ButtonStyle.Link)
              .setURL(privacyPolicyURL));

        if (termsOfServiceURL)
          components[0]
            .addComponents(new ButtonBuilder()
              .setLabel('Terms of service')
              .setStyle(ButtonStyle.Link)
              .setURL(termsOfServiceURL));
      }
    }

    return interaction.reply({ components, embeds, ephemeral: true });
  }
}