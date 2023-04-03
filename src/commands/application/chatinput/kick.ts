import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Collection, EmbedBuilder, PermissionFlagsBits, User } from "discord.js";
import client from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
/* import { t } from "../../../translator"; */
import { t } from "../../../translator";
import { isKickableBy } from "../../../util/commands/utils";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Moderation",
      appPermissions: ["KickMembers"],
      userPermissions: ["KickMembers"],
    });

    this.data.setName("kick")
      .setDescription("Kicks a user from the server.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .setNameLocalizations(getLocalizations("kickName"))
      .setDescriptionLocalizations(getLocalizations("kickDescription"))
      .addStringOption(option => option.setName("users")
        .setDescription("The user to kick.")
        .setNameLocalizations(getLocalizations("kickUserName"))
        .setDescriptionLocalizations(getLocalizations("kickUserDescription"))
        .setRequired(true))
      .addStringOption(option => option.setName("reason")
        .setDescription("The reason to kick.")
        .setNameLocalizations(getLocalizations("kickReasonName"))
        .setDescriptionLocalizations(getLocalizations("kickReasonDescription"))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const usersId = interaction.options.getString("users")?.match(/\d{17,}/g);

    if (!usersId?.length) {
      await interaction.editReply(t("noIdsInUserInput", interaction.locale));
      return 1;
    }

    const members = await interaction.guild.members.fetch({ user: usersId });

    const users = new Collection<string, User>();

    const promises = [];

    for (const id of usersId) {
      if (members.has(id)) continue;

      promises.push(client.users.fetch(id)
        .then(user => users.set(id, user))
        .catch(() => null));
    }

    await Promise.all(promises);

    members.sweep(member => !member.kickable || !isKickableBy(member, interaction.member));

    if (!members.size && !users.size) {
      await interaction.editReply(t("noKickableFoundInUsersInput", interaction.locale));
      return 1;
    }

    const reason = interaction.options.getString("reason") || "-";

    const embeds: EmbedBuilder[] = [];

    if (members.size) {
      embeds.push(new EmbedBuilder()
        .setDescription(members.toJSON().join(" ").slice(0, 4096))
        .setFields([{
          name: t("kickReason", interaction.locale),
          value: reason,
        }])
        .setTitle(`${t("memberKickGroup", interaction.locale)} [${members.size}]`));
    }

    if (users.size) {
      embeds.push(new EmbedBuilder()
        .setDescription(users.toJSON().join(" ").slice(0, 4096))
        .setFields([{
          name: t("kickReason", interaction.locale),
          value: reason,
        }])
        .setTitle(`${t("userKickGroup", interaction.locale)} [${users.size}]`));
    }

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "kick",
                a: true,
              }))
              .setEmoji("⚠")
              .setLabel("Yes")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
      embeds,
    });

    return;
  }
}
