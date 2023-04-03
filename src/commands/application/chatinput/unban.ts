import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Moderation",
      appPermissions: ["BanMembers"],
      userPermissions: ["BanMembers"],
    });

    this.data.setName("unban")
      .setDescription("Revoke a user's ban.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .setNameLocalizations(getLocalizations("unbanName"))
      .setDescriptionLocalizations(getLocalizations("unbanDescription"))
      .addStringOption(option => option.setName("user")
        .setDescription("User ID")
        .setNameLocalizations(getLocalizations("unbanUserName"))
        .setDescriptionLocalizations(getLocalizations("unbanUserDescription"))
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName("reason")
        .setDescription("The reason to unban.")
        .setNameLocalizations(getLocalizations("unbanReasonName"))
        .setDescriptionLocalizations(getLocalizations("unbanReasonDescription"))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getString("user", true);

    const ban = await interaction.guild.bans.fetch(id);

    if (!ban) {
      await interaction.editReply(t("ban404", interaction.locale));
      return 1;
    }

    const reason = `${interaction.member.displayName}: ${interaction.options.getString("reason") || "-"}`
      .slice(0, 512);

    try {
      await interaction.guild.bans.remove(id, reason);
    } catch (error) {
      await interaction.editReply(t("unbanError", interaction.locale));
      throw error;
    }

    await interaction.editReply(t("userUnbanned", interaction.locale));
    return;
  }
}
