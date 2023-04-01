import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Utility",
    });

    this.data.setName("avatar")
      .setDescription("Replies with the user's profile picture.");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("avatarName"))
      .setDescriptionLocalizations(getLocalizations("avatarDescription"))
      .addUserOption(option => option.setName("user")
        .setDescription("Select a user to get their profile picture.")
        .setNameLocalizations(getLocalizations("avatarUserName"))
        .setDescriptionLocalizations(getLocalizations("avatarUserDescription")));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.options.getMember("user") ?? interaction.member;
    const user = interaction.options.getUser("user") ?? interaction.user;
    const target = member ?? user;

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

    if (member?.avatar && member.avatar !== user.avatar) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: user.id,
            next: "user",
          }))
          .setLabel(t("viewUserAvatar", { locale }))
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = user.displayAvatarURL().split("/").pop();

    await interaction.editReply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(member?.displayColor ?? user.accentColor ?? "Random")
          .setDescription(`${user}`)
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
