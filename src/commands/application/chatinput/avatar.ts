import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildMember, User } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
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
    const member = interaction.options.getMember("user") ?? interaction.member;
    const user = interaction.options.getUser("user") ?? interaction.user;
    const target = <GuildMember | User>member ?? user;

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

    if (member?.avatar && member.avatar !== user.avatar) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: user.id,
            next: "user",
          }))
          .setLabel("User avatar")
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = user.displayAvatarURL().split("/").pop();

    await interaction.reply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(member?.displayColor ?? user.accentColor ?? "Random")
          .setDescription(`${user}`)
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
