import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import ms from "ms";
import cache from "../../../modules/Cache";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import Ban from "../../../util/Ban";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "ban",
      appPermissions: ["BanMembers"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    await interaction.update({
      components: [],
    });

    const [reasonField, deleteField] = interaction.message.embeds[0].fields;

    const reason = `${interaction.member.displayName}: ${reasonField.value}`
      .slice(0, 512);

    const deleteMessageSeconds = ms(deleteField.value) / 1000;

    const ban = new Ban({
      author: interaction.member,
      deleteMessageSeconds,
      guild: interaction.guild,
      reason,
      usersId: [],
    });

    const cancelId = JSON.stringify({
      c: "ban",
      sc: "cancel",
      d: interaction.id,
    });

    cache.set(cancelId, ban);

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g);

      if (ids?.length) {
        ban.addUsersId(ids);
      }
    }

    async function listener() {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription((
              (ban.banned.length ? `✅ ${ban.banned.join(" ")}\n` : "")
              + (ban.failed.length ? `\n❌ ${ban.failed.join(" ")}` : "")
            ) || null)
            .setFields([{
              name: t("bannedAmount", interaction.locale),
              value: `${ban.banned.length}/${ban.usersId.size}`,
            }])
            .setTitle(t("banResult", interaction.locale)),
        ],
      }).catch(() => null);
    }

    ban.on("banned", listener);

    ban.once("end", function () {
      ban.removeListener("banned", listener);
    });

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(new ButtonBuilder()
            .setCustomId(cancelId)
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)),
      ],
      content: t("banning", interaction.locale) + "...",
    });

    await ban.start();
    cache.delete(cancelId);

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setDescription((
            (ban.banned.length ? `✅ ${ban.banned.join(" ")}\n` : "")
            + (ban.failed.length ? `\n❌ ${ban.failed.join(" ")}` : "")
          ) || null)
          .setFields([{
            name: t("bannedAmount", interaction.locale),
            value: `${ban.banned.length}/${ban.usersId.size}`,
          }])
          .setTitle(t("banResult", interaction.locale)),
      ],
    });

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    const clear = <Ban>cache.get(interaction.customId);

    clear?.stop();

    cache.delete(interaction.customId);

    await interaction.update({
      components: [],
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setTitle(`❌ ${t("cancelled", interaction.locale)}.`),
      ],
    });

    return;
  }
}
