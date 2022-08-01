import { InteractionType, PermissionsString } from 'discord.js';
import { MissingPermissionResponse } from '../@enum';
import type { AnyInteraction } from '../@types';
import BaseCommand from './BaseCommand';

export default abstract class BaseApplicationCommand extends BaseCommand {
  constructor() {
    super();
  }

  abstract execute(...args: any): Promise<any>;

  replyOnlyOnServer(interaction: AnyInteraction) {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return interaction.respond([]);

    const embeds = [
      this.Util.EmbedHelper({
        description: this.t('onlyOnServer', { locale: interaction.locale }),
      }, 'Warning'),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.type === InteractionType.MessageComponent)
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

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return interaction.respond([]);

    const embeds = [
      this.Util.EmbedHelper({
        description: this.t(key, {
          locale: interaction.locale,
          permission: this.t(permission[0], { locale: interaction.locale }),
        }),
      }, 'Error'),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.type === InteractionType.MessageComponent)
        return interaction.followUp({ embeds, ephemeral: true });

      return interaction.editReply({ embeds });
    }

    return interaction.reply({ embeds, ephemeral: true });
  }
}