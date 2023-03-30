import { ActionRowBuilder, bold, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, messageLink } from "discord.js";
import client from "../../../client";
import cache from "../../../modules/Cache";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import ClearMessages from "../../../util/ClearMessages";
import { calculateBitFieldFromSelectMenus } from "../../../util/commands/components/selectmenu";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "clear_context",
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    if (!interaction.channel?.isTextBased()) return;

    const locale = interaction.locale;

    const appPerms = interaction.channel.permissionsFor(client.user!)
      ?.missing(this.options.channelAppPermissions!);

    if (appPerms?.length) {
      await this.replyMissingPermission(interaction, appPerms, "missingChannelPermission");
      return 1;
    }

    const cancelId = JSON.stringify({
      c: "clear",
      sc: "cancel",
      d: interaction.id,
    });

    const parsedId = JSON.parse(interaction.customId);

    const targetUser = interaction.message.embeds[0]
      .description?.match(/\d{17,}/g);

    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(new ButtonBuilder()
            .setCustomId(cancelId)
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)),
      ],
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setDescription(bold(t("tryingEraseMessagesUntil", {
            locale,
            url: messageLink(interaction.channelId, parsedId.msgId),
          })))
          .setTitle(null),
      ],
    });

    const bits = calculateBitFieldFromSelectMenus(interaction.message.components);

    const clear = new ClearMessages({
      afterMessage: parsedId.msgId,
      channel: interaction.channel,
      filter: Number(bits),
      targetUser,
      interaction,
    });

    cache.set(cancelId, clear);

    try {
      await clear.clear();
    } catch (error) {
      cache.delete(cancelId);

      await interaction.editReply({
        components: [],
        content: t("messageDeleteError", { locale }),
        embeds: [],
      });

      throw error;
    }

    cache.delete(cancelId);

    await interaction.editReply({
      components: [],
      content: t(clear.cleared ? "messageDeleted" : "noDeletedMessages", {
        count: clear.cleared,
        locale,
        size: clear.cleared,
      }),
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setTitle((clear.cancelled ? "❌ " : "✅ ")
            + t(clear.cleared ? "messageDeleted" : "noDeletedMessages", {
              count: clear.cleared,
              locale,
              size: clear.cleared,
            }))
          .spliceFields(1, 1, {
            name: t("result", { locale }),
            value: `> ${t("found", { locale })}: ${clear.found}.`
              + `\n> ${t("ignored", { locale })}: ${clear.ignored}.`,
          }),
      ],
    });

    return;
  }
}
