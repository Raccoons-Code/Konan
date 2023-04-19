import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, OAuth2Scopes, PermissionFlagsBits, PermissionsString, bold, inlineCode } from "discord.js";
import { MissingPermissionResponse } from "../@enum";
import { CommandOptions } from "../@types";
import client from "../client";
import commandHandler from "../handlers/CommandHandler";
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
        .setDescription(t("onlyOnServer", interaction.locale)),
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

    const components = [];

    if (
      key === "missingPermission" &&
      interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
    ) {
      components.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder()
          .setEmoji("🔐")
          .setLabel(t("grantMePermissions", interaction.locale))
          .setStyle(ButtonStyle.Link)
          .setURL(client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            disableGuildSelect: true,
            guild: interaction.guild ?? undefined,
            permissions: commandHandler.permissions,
          }))));
    }

    const embeds = [
      new EmbedBuilder()
        .setDescription(bold(t(key, {
          locale: interaction.locale,
          permission: t(permission[0], interaction.locale),
        }))),
    ];

    const other = permission.slice(1);

    if (other.length) {
      embeds[0].addFields({
        name: t("otherMissingPermissions", interaction.locale),
        value: other
          .map(perm => inlineCode(t(perm, interaction.locale)))
          .join("\n").slice(0, 1024),
      });
    }

    if (interaction.deferred || interaction.replied) {
      if (interaction.isMessageComponent()) {
        await interaction.followUp({ components, embeds, ephemeral: true });
        return;
      }

      await interaction.editReply({ components, embeds });
      return;
    }

    await interaction.reply({ components, embeds, ephemeral: true });
    return;
  }
}
