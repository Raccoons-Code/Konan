import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits, User } from "discord.js";
import client from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
/* import { t } from "../../../translator"; */
import { isKickableBy } from "../../../util/commands/utils";
import { getLocalizations } from "../../../util/utils";
import { t } from "../../../translator";

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

    const locale = interaction.locale;

    const usersId = interaction.options.getString("users")?.match(/\d{17,}/g);

    if (!usersId?.length) {
      await interaction.editReply(t("noIdsInUserInput", { locale }));
      return 1;
    }

    let members = await interaction.guild.members.fetch({ user: usersId })
      .then(members => members.toJSON())
      .catch(() => <GuildMember[]>[]);

    const users = await Promise.all(usersId
      .filter(id => !members.some(member => member.id === id))
      .map(id => client.users.fetch(id).catch(() => null)))
      .then(users => <User[]>users.filter(user => user));

    if (!members.length && !users.length) {
      await interaction.editReply("No kickable users were found in the users input.");
      return 1;
    }

    members = members.filter(member => member.kickable &&
      isKickableBy(member, interaction.member));

    const reason = interaction.options.getString("reason") || "-";

    /* if ((members.length + users.length) < 2) {
      const [user] = [...members, ...users];

      if ("kickable" in user) {
        if (!user.kickable || !isKickableBy(user, interaction.member)) {
          await interaction.editReply(t("kickHierarchyError", { locale }));
          return 1;
        }
      }

      try {
        await interaction.guild.members.kick(user.id, reason);
      } catch (error) {
        await interaction.editReply(t("kickError", { locale }));
        throw error;
      }

      await interaction.editReply(t("userKicked", { locale }));
      return;
    } */

    const embeds: EmbedBuilder[] = [];

    if (members.length) {
      embeds.push(new EmbedBuilder()
        .setDescription(members.join(" ").slice(0, 4096))
        .setFields([{
          name: "Reason for kick",
          value: reason,
        }])
        .setTitle(members.length > 1 ? `Chunk of members to kick [${members.length}]` : "Kick member"));
    }

    if (users.length) {
      embeds.push(new EmbedBuilder()
        .setDescription(users.join(" ").slice(0, 4096))
        .setFields([{
          name: "Reason for kick",
          value: reason,
        }])
        .setTitle(users.length > 1 ? `Chunk of users to kick [${users.length}]` : "Kick user"));
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
