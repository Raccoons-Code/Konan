import { ButtonInteraction, EmbedBuilder, GuildMember, User, userMention } from "discord.js";
import { setTimeout as sleep } from "node:timers/promises";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";

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

    const kicking: Promise<void>[] = [];
    const kicked: (string | GuildMember | User)[] = [];
    const failed: string[] = [];
    let index = 0;
    let num = 0;

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g);

      if (ids?.length) {
        num += ids.length;
      }
    }

    await interaction.editReply({
      content: t("kicking", interaction.locale) + "...",
    });

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g) ?? [];

      const [reasonField] = embed.fields;

      const reason = `${interaction.member.displayName}: ${reasonField.value}`
        .slice(0, 512);

      kicking.push(...ids.map(async (id, i) => {
        await sleep((i + index) * 1000);

        try {
          const kick = await interaction.guild.members.kick(id, reason);

          kicked.push(kick);
        } catch {
          failed.push(userMention(id));
        }

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription((
                (kicked.length ? `✅ ${kicked.join(" ")}\n` : "")
                + (failed.length ? `\n❌ ${failed.join(" ")}` : "")
              ) || null)
              .setFields([{
                name: t("kickedAmount", interaction.locale),
                value: `${kicked.length}/${num}`,
              }])
              .setTitle(t("kickResult", interaction.locale)),
          ],
        }).catch(() => null);
      }));

      index += ids.length;
    }

    await Promise.all(kicking);

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setDescription((
            (kicked.length ? `✅ ${kicked.join(" ")}\n` : "")
            + (failed.length ? `\n❌ ${failed.join(" ")}` : "")
          ) || null)
          .setFields([{
            name: t("kickedAmount", interaction.locale),
            value: `${kicked.length}/${num}`,
          }])
          .setTitle(t("kickResult", interaction.locale)),
      ],
    });

    return;
  }
}
