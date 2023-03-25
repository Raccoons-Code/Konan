import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits, User } from "discord.js";
import ms from "ms";
import client from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
/* import { t } from "../../../translator"; */
import { isBannableBy } from "../../../util/commands/utils";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Moderation",
      appPermissions: ["BanMembers"],
      userPermissions: ["BanMembers"],
    });

    this.data.setName("ban")
      .setDescription("Bans a user from the server.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .setNameLocalizations(getLocalizations("banName"))
      .setDescriptionLocalizations(getLocalizations("banDescription"))
      .addStringOption(option => option.setName("users")
        .setDescription("Ban users.")
        .setNameLocalizations(getLocalizations("banSingleName"))
        .setDescriptionLocalizations(getLocalizations("banSingleDescription"))
        .setRequired(true))
      .addIntegerOption(option => option.setName("delete_messages")
        .setDescription("How much of that person's message history should be deleted.")
        .setNameLocalizations(getLocalizations("banSingleDeleteMessagesName"))
        .setDescriptionLocalizations(getLocalizations("banSingleDeleteMessagesDescription"))
        .setChoices({
          name: "Last 1 hours",
          value: 60 * 60,
          name_localizations: getLocalizations("lastNHours", { n: 1 }),
        }, {
          name: "Last 6 hours",
          value: 60 * 60 * 6,
          name_localizations: getLocalizations("lastNHours", { n: 6 }),
        }, {
          name: "Last 24 hours",
          value: 60 * 60 * 24,
          name_localizations: getLocalizations("lastNHours", { n: 24 }),
        }, {
          name: "Last 3 days",
          value: 60 * 60 * 24 * 3,
          name_localizations: getLocalizations("lastNDays", { n: 3 }),
        }, {
          name: "Last 7 days",
          value: 60 * 60 * 24 * 7,
          name_localizations: getLocalizations("lastNDays", { n: 7 }),
        }))
      .addStringOption(option => option.setName("reason")
        .setDescription("The reason for the ban.")
        .setNameLocalizations(getLocalizations("banSingleReasonName"))
        .setDescriptionLocalizations(getLocalizations("banSingleReasonDescription"))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    /* const locale = interaction.locale; */

    const usersId = interaction.options.getString("users")?.match(/\d{17,}/g);

    if (!usersId?.length) {
      await interaction.editReply("No IDs were found in the users input.");
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
      await interaction.editReply("No bannable users were found in the users input.");
      return 1;
    }

    members = members.filter(member => member.bannable &&
      isBannableBy(member, interaction.member));

    const seconds = interaction.options.getInteger("delete_messages") ?? 0;

    const reason = interaction.options.getString("reason") || "-";

    /* if ((members.length + users.length) < 2) {
      const [user] = [...members, ...users];

      if ("bannable" in user) {
        if (!user.bannable || !isBannableBy(user, interaction.member)) {
          await interaction.editReply(t("banHierarchyError", { locale }));
          return 1;
        }
      }

      try {
        await interaction.guild.bans.create(user.id, {
          deleteMessageSeconds: seconds,
          reason,
        });
      } catch (error) {
        await interaction.editReply(t("banError", { locale }));
        throw error;
      }

      await interaction.editReply(t("userBanned", { locale }));
      return;
    } */

    const embeds: EmbedBuilder[] = [];

    if (members.length) {
      embeds.push(new EmbedBuilder()
        .setDescription(members.join(" ").slice(0, 4096))
        .setFields([{
          name: "Reason for ban",
          value: reason,
        }, {
          name: "Delete messages",
          value: seconds ? ms(seconds * 1000) : "-",
        }])
        .setTitle(members.length > 1 ? `Chunk of members to ban [${members.length}]` : "Ban member"));
    }

    if (users.length) {
      embeds.push(new EmbedBuilder()
        .setDescription(users.join(" ").slice(0, 4096))
        .setFields([{
          name: "Reason for ban",
          value: reason,
        }, {
          name: "Delete messages",
          value: seconds ? ms(seconds * 1000) : "-",
        }])
        .setTitle(users.length > 1 ? `Chunk of users to ban [${users.length}]` : "Ban user"));
    }

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "ban",
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
