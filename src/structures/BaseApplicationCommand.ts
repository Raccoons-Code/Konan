import { APIApplicationCommandOptionChoice, ApplicationCommandOptionAllowedChannelTypes, ButtonStyle, ChannelType, GuildTextChannelType, PermissionsString } from 'discord.js';
import { MissingPermissionResponse } from '../@enum';
import type { AnyInteraction } from '../@types';
import { client } from '../client';
import BaseCommand from './BaseCommand';

const { AnnouncementThread, GuildAnnouncement, GuildText, GuildVoice, PrivateThread, PublicThread } = ChannelType;

export default abstract class BaseApplicationCommand extends BaseCommand {
  abstract data: any;

  constructor() {
    super();
  }

  build() {
    return this.data;
  }

  abstract execute(...args: any): Promise<any>;

  get id() {
    return `${client.application?.commands.cache.find(c => c.name === this.data.name)?.id}`;
  }

  get command_mention() {
    return `</${this.data.name}:${this.id}>`;
  }

  getCommandMention(subGroup?: string, subCommand?: string) {
    if (subCommand)
      return `</${this.data.name} ${subGroup} ${subCommand}:${this.id}>`;

    if (subGroup)
      return `</${this.data.name} ${subGroup}:${this.id}>`;

    return `</${this.data.name}:${this.id}>`;
  }

  toString() {
    return this.command_mention;
  }

  replyOnlyOnServer(interaction: AnyInteraction) {
    if (interaction.isAutocomplete()) return interaction.respond([]);

    const embeds = [
      this.Util.EmbedHelper({
        description: this.t('onlyOnServer', { locale: interaction.locale }),
      }, 'Warning'),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.isMessageComponent())
        return interaction.followUp({ embeds, ephemeral: true });

      return interaction.editReply({ embeds });
    }

    return interaction.reply({ embeds, ephemeral: true });
  }

  replyMissingPermission(
    interaction: AnyInteraction,
    permission: PermissionsString | PermissionsString[],
    key: `${MissingPermissionResponse}`,
  ) {
    if (!Array.isArray(permission)) permission = [permission];

    if (interaction.isAutocomplete()) return interaction.respond([]);

    const embeds = [
      this.Util.EmbedHelper({
        description: this.t(key, {
          locale: interaction.locale,
          permission: this.t(permission[0], { locale: interaction.locale }),
        }),
      }, 'Error'),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.isMessageComponent())
        return interaction.followUp({ embeds, ephemeral: true });

      return interaction.editReply({ embeds });
    }

    return interaction.reply({ embeds, ephemeral: true });
  }

  buttonStyles: { name: keyof typeof ButtonStyle, value: ButtonStyle }[] = [
    { name: 'Primary', value: ButtonStyle.Primary },
    { name: 'Secondary', value: ButtonStyle.Secondary },
    { name: 'Success', value: ButtonStyle.Success },
    { name: 'Danger', value: ButtonStyle.Danger },
  ];

  ButtonStylesChoices: APIApplicationCommandOptionChoice<number>[] = this.buttonStyles.map(style => ({
    name: style.name,
    value: style.value,
    name_localizations: this.getLocalizations(style.name),
  }));

  GuildTextChannelTypes: Extract<ApplicationCommandOptionAllowedChannelTypes, GuildTextChannelType>[] =
    [AnnouncementThread, GuildAnnouncement, GuildText, GuildVoice, PrivateThread, PublicThread];

  get randomButtonStyle() {
    return this.buttonStyles[Math.floor(Math.random() * this.buttonStyles.length)];
  }

  getChoicesFromEnum<
    V extends number | string = number | string,
    T extends Record<any, any> = Record<number | string, number | string>
  >(
    enumType: T,
    withLocalizations = true,
  ) {
    return Object.entries(enumType)
      .filter(e => isNaN(<any>e[0]))
      .map(([key, value]) => ({
        name: this.t(key, { locale: 'en' }),
        value: value as V,
        name_localizations: withLocalizations ? this.getLocalizations(key) : {},
      }));
  }
}