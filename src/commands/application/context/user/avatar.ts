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

    await interaction.targetUser.fetch();

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel(t("link", interaction.locale))
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
          .setLabel(t("viewUserAvatar", interaction.locale))
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
          .setLabel(t("viewUserBanner", interaction.locale))
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
        new AttachmentBuilder(target.displayAvatarURL({ size: 512 }), { name }),
      ],
    });

    return;
  }
}
