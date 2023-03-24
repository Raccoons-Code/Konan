import { ButtonInteraction, EmbedBuilder, GuildMember, User, userMention } from "discord.js";
import ms from "ms";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "ban",
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const banning: Promise<string | void | GuildMember | User>[] = [];
    const failed: string[] = [];

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g) ?? [];

      const [reasonField, deleteField] = embed.fields;

      const reason = `${interaction.member.displayName}: ${reasonField.value}`
        .slice(0, 512);

      const deleteMessageSeconds = ms(deleteField.value) / 1000;

      banning.push(...ids.map(id =>
        interaction.guild.bans.create(id, {
          deleteMessageSeconds,
          reason,
        })
          .catch(() => {
            failed.push(userMention(id));
          })));
    }

    const banned = await Promise.all(banning)
      .then(bans => bans.filter(ban => ban));

    await interaction.update({
      components: [],
      embeds: [
        new EmbedBuilder()
          .setDescription(failed.length ? `❌ ${failed.join(" ")}`.slice(0, 4096) : null)
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
