import { ButtonInteraction, EmbedBuilder, GuildMember, User, userMention } from "discord.js";
import ms from "ms";
import { setTimeout as sleep } from "node:timers/promises";
import ButtonCommand from "../../../structures/ButtonCommand";

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

    const banning: Promise<void>[] = [];
    const banned: (string | User | GuildMember)[] = [];
    const failed: string[] = [];
    let index = 0;

    await interaction.editReply({
      content: "Banning...",
    });

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g) ?? [];

      const [reasonField, deleteField] = embed.fields;

      const reason = `${interaction.member.displayName}: ${reasonField.value}`
        .slice(0, 512);

      const deleteMessageSeconds = ms(deleteField.value) / 1000;

      banning.push(...ids.map(async (id, i) => {
        await sleep((i + index) * 1000);

        try {
          const ban = await interaction.guild.bans.create(id, {
            deleteMessageSeconds,
            reason,
          });

          banned.push(ban);
        } catch {
          failed.push(userMention(id));
        }

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(failed.length ?
                `❌ ${failed.join(" ")}`.slice(0, 4096) :
                null)
              .setFields([{
                name: "Amount of banned users",
                value: `${banned.length}/${ids.length}`,
              }])
              .setTitle("Ban Result"),
          ],
        }).catch(() => null);
      }));

      index += ids.length;
    }

    await Promise.all(banning);

    await interaction.editReply({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setDescription(failed.length ?
            `❌ ${failed.join(" ")}`.slice(0, 4096) :
            null)
          .setFields([{
            name: "Amount of banned users",
            value: `${banned.length}/${banned.length + failed.length}`,
          }])
          .setTitle("Ban Result"),
      ],
    });

    return;
  }
}
