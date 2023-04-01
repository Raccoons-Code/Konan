import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, UserContextMenuCommandInteraction } from "discord.js";
import UserContextCommand from "../../../../structures/UserContextCommand";
import { getLocalizations } from "../../../../util/utils";

export default class extends UserContextCommand {
  constructor() {
    super();

    this.data.setName("View avatar");
  }

  build() {
    this.data.setNameLocalizations(getLocalizations("viewAvatar"));
  }

  async execute(interaction: UserContextMenuCommandInteraction<"cached">) {
    const target = interaction.targetMember ?? interaction.targetUser;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel("Link")
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
          .setLabel("User avatar")
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = target.displayAvatarURL().split("/").pop();

    await interaction.reply({
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
      ephemeral: true,
      files: [
        new AttachmentBuilder(target.displayAvatarURL({ size: 512 }), { name }),
      ],
    });

    return;
  }
}
