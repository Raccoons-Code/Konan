import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import cache from "../../../modules/Cache";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import Kick from "../../../util/Kick";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "kick",
      appPermissions: ["KickMembers"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    await interaction.update({
      components: [],
    });

    const [reasonField] = interaction.message.embeds[0].fields;

    const reason = `${interaction.member.displayName}: ${reasonField.value}`
      .slice(0, 512);

    const kick = new Kick({
      author: interaction.member,
      guild: interaction.guild,
      reason,
      usersId: [],
    });

    const cancelId = JSON.stringify({
      c: "kick",
      sc: "cancel",
      d: interaction.id,
    });

    cache.set(cancelId, kick);

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g);

      if (ids?.length) {
        kick.addUsersId(ids);
      }
    }

    async function listener() {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription((
              (kick.kicked.length ? `✅ ${kick.kicked.join(" ")}\n` : "")
              + (kick.failed.length ? `\n❌ ${kick.failed.join(" ")}` : "")
            ) || null)
            .setFields([{
              name: t("kickedAmount", interaction.locale),
              value: `${kick.kicked.length}/${kick.usersId.size}`,
            }])
            .setTitle(t("kickResult", interaction.locale)),
        ],
      });
    }

    kick.on("kicked", listener);

    kick.once("end", function () {
      kick.removeListener("kicked", listener);
    });

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(new ButtonBuilder()
            .setCustomId(cancelId)
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)),
      ],
      content: t("kicking", interaction.locale) + "...",
    });

    await kick.start();
    cache.delete(cancelId);

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setDescription((
            (kick.kicked.length ? `✅ ${kick.kicked.join(" ")}\n` : "")
            + (kick.failed.length ? `\n❌ ${kick.failed.join(" ")}` : "")
          ) || null)
          .setFields([{
            name: t("kickedAmount", interaction.locale),
            value: `${kick.kicked.length}/${kick.usersId.size}`,
          }])
          .setTitle(t("kickResult", interaction.locale)),
      ],
    });

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    const clear = <Kick>cache.get(interaction.customId);

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
