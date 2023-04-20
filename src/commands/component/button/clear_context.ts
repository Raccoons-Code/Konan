import { ActionRowBuilder, bold, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, messageLink } from "discord.js";
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

    await interaction.update({
      components: [],
    });

    const locale = interaction.locale;

    const cancelId = JSON.stringify({
      c: "clear",
      sc: "cancel",
      d: interaction.id,
    });

    const parsedId = JSON.parse(interaction.customId);

    const target = interaction.message.embeds[0]?.description?.match(/\d{17,}/g);

    await interaction.editReply({
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
      target,
    });

    cache.set(cancelId, clear);

    async function listener() {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder(interaction.message.embeds[0]?.toJSON())
            .spliceFields(1, 1, {
              name: t("result", interaction.locale),
              value: `> ${t("found", interaction.locale)}: ${clear.found}`
                + `${clear.amount ? ` / ${clear.amount}` : ""}.`
                + `\n> ${t("deleted", interaction.locale)}: ${clear.cleared}.`
                + `\n> ${t("ignored", interaction.locale)}: ${clear.ignored.count}.`
                + (clear.ignored.olds ?
                  `\n> ${t("ignoredVeryOld", interaction.locale)}: ${clear.ignored.olds}` :
                  ""),
              inline: true,
            }),
        ],
      });
    }

    clear.on("messageDeleteBulk", listener);

    clear.once("end", function () {
      clear.removeListener("messageDeleteBulk", listener);
    });

    try {
      await clear.clear();
    } catch (error) {
      cache.delete(cancelId);

      await interaction.editReply({
        components: [],
        content: t("messageDeleteError", interaction.locale),
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
            name: t("result", interaction.locale),
            value: `> ${t("found", interaction.locale)}: ${clear.found} / ${clear.amount}.`
              + `\n> ${t("ignored", interaction.locale)}: ${clear.ignored.count}.`
              + (clear.ignored.olds ?
                `\n> ${t("ignoredVeryOld", interaction.locale)}: ${clear.ignored.olds}` :
                ""),
          }),
      ],
    });

    return;
  }
}
