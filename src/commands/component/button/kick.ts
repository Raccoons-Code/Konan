import { ButtonInteraction, EmbedBuilder, GuildMember, User, userMention } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "kick",
      appPermissions: ["KickMembers"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const kicking: Promise<string | void | GuildMember | User>[] = [];
    const failed: string[] = [];

    for (const embed of interaction.message.embeds) {
      const ids = embed.description?.match(/\d{17,}/g) ?? [];

      const [reasonField] = embed.fields;

      const reason = `${interaction.member.displayName}: ${reasonField.value}`
        .slice(0, 512);

      kicking.push(...ids.map(id =>
        interaction.guild.members.kick(id, reason)
          .catch(() => {
            failed.push(userMention(id));
          })));
    }

    const kicked = await Promise.all(kicking)
      .then(kicks => kicks.filter(kick => kick));

    await interaction.update({
      components: [],
      embeds: [
        new EmbedBuilder()
          .setDescription(failed.length ? `❌ ${failed.join(" ")}`.slice(0, 4096) : null)
          .setFields([{
            name: "Amount of kicked users",
            value: `${kicked.length}/${kicked.length + failed.length}`,
          }])
          .setTitle("Kick Result"),
      ],
    });

    return;
  }
}
