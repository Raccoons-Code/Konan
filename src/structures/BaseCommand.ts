import { EmbedBuilder, Interaction, PermissionsString } from "discord.js";
import { MissingPermissionResponse } from "../@enum";
import { CommandOptions } from "../@types";
import { t } from "../translator";
import Base from "./Base";

export default abstract class BaseCommand extends Base {
  abstract data: any;

  constructor(public options: CommandOptions = {}) {
    super();
  }

  abstract execute(...args: any): Promise<any>;

  async replyOnlyOnServer(interaction: Interaction) {
    if (interaction.isAutocomplete()) {
      await interaction.respond([]);
      return;
    }

    const embeds = [
      new EmbedBuilder()
        .setDescription(t("onlyOnServer", { locale: interaction.locale })),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.isMessageComponent()) {
        await interaction.followUp({ embeds, ephemeral: true });
        return;
      }

      await interaction.editReply({ embeds });
      return;
    }

    await interaction.reply({ embeds, ephemeral: true });
    return;
  }

  async replyMissingPermission(
    interaction: Interaction,
    permission: PermissionsString | PermissionsString[],
    key: `${MissingPermissionResponse}`,
  ) {
    if (!Array.isArray(permission)) permission = [permission];

    if (interaction.isAutocomplete()) {
      await interaction.respond([]);
      return;
    }

    const embeds = [
      new EmbedBuilder()
        .setDescription(t(key, {
          locale: interaction.locale,
          permission: t(permission[0], { locale: interaction.locale }),
        })),
    ];

    if (interaction.deferred || interaction.replied) {
      if (interaction.isMessageComponent()) {
        await interaction.followUp({ embeds, ephemeral: true });
        return;
      }

      await interaction.editReply({ embeds });
      return;
    }

    await interaction.reply({ embeds, ephemeral: true });
    return;
  }
}
