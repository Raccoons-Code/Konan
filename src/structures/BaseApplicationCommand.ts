import { PermissionsString } from 'discord.js';
import { MissingPermissionResponse } from '../@enum';
import type { AnyInteraction } from '../@types';
import { client } from '../client';
import BaseCommand from './BaseCommand';

export default abstract class BaseApplicationCommand extends BaseCommand {
  data!: any;

  constructor() {
    super();
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
}