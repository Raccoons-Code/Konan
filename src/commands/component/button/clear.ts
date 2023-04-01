import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildTextBasedChannel } from "discord.js";
import client from "../../../client";
import cache from "../../../modules/Cache";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import ClearMessages from "../../../util/ClearMessages";
import { calculateBitFieldFromSelectMenus } from "../../../util/commands/components/selectmenu";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "clear",
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"clear">parsedId.sc]?.(interaction);

    return;
  }

  async clear(interaction: ButtonInteraction<"cached">) {
    await interaction.update({
      components: [],
    });

    const locale = interaction.locale;

    const parsedId = JSON.parse(interaction.customId);

    const channel = await interaction.guild.channels.fetch(parsedId.channel) as GuildTextBasedChannel;

    if (!channel?.isTextBased()) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Missing channel."),
        ],
      });
      return 1;
    }

    const appPerms = channel.permissionsFor(client.user!)
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
          .setTitle(t("tryingEraseNMessages", {
            locale,
            amount: parsedId.amount,
          })),
      ],
    });

    const bits = calculateBitFieldFromSelectMenus(interaction.message.components);

    const target = interaction.message.embeds[0]?.description?.match(/\d{17,}/g);

    const clear = new ClearMessages({
      channel,
      amount: parsedId.amount,
      filter: Number(bits),
      target,
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
              + `\n> ${t("ignored", { locale })}: ${clear.ignored.count}.`
              + (clear.ignored.olds ?
                `\n> ${t("ignoredVeryOld", { locale })}: ${clear.ignored.olds}` :
                ""),
          }),
      ],
    });

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    const clear = <ClearMessages>cache.get(interaction.customId);

    clear?.stop();

    cache.delete(interaction.customId);

    await interaction.update({
      components: [],
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setTitle(`❌ ${t("cancelled", { locale: interaction.locale })}.`),
      ],
    });

    return;
  }
}
