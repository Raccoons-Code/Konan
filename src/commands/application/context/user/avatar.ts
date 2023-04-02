import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, UserContextMenuCommandInteraction } from "discord.js";
import UserContextCommand from "../../../../structures/UserContextCommand";
import { t } from "../../../../translator";
import { getLocalizations } from "../../../../util/utils";

export default class extends UserContextCommand {
  constructor() {
    super();

    this.data.setName("View avatar");
  }

  build() {
    this.data.setNameLocalizations(getLocalizations("viewAvatarName"));
  }

  async execute(interaction: UserContextMenuCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.targetMember ?? interaction.targetUser;

    interaction.targetUser.banner ?? await interaction.targetUser.fetch();

    const locale = interaction.locale;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel(t("link", { locale }))
            .setStyle(ButtonStyle.Link)
            .setURL(target.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    if (
      interaction.targetMember?.avatar &&
      interaction.targetMember.avatar !== interaction.targetUser.avatar
    ) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: interaction.targetUser.id,
            next: "user",
          }))
          .setLabel(t("viewUserAvatar", { locale }))
          .setStyle(ButtonStyle.Secondary),
      );
    }

    if (interaction.targetUser.banner) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: interaction.targetUser.id,
            next: "banner",
          }))
          .setLabel(t("viewUserBanner", { locale }))
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = target.displayAvatarURL().split("/").pop();

    await interaction.editReply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(
            interaction.targetMember?.displayColor ??
            interaction.targetUser.accentColor ??
            "Random",
          )
          .setDescription(`${target}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(
          await fetch(target.displayAvatarURL({ size: 512 }))
            .then(res => res.arrayBuffer())
            .then(res => Buffer.from(res)), {
          name,
        }),
      ],
    });

    return;
  }
}
