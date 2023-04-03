import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Collection, EmbedBuilder, PermissionFlagsBits, User } from "discord.js";
import ms from "ms";
import client from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
/* import { t } from "../../../translator"; */
import { t } from "../../../translator";
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

    members.sweep(member => !member.bannable || !isBannableBy(member, interaction.member));

    if (!members.size && !users.size) {
      await interaction.editReply(t("noBannableFoundInUsersInput", interaction.locale));
      return 1;
    }

    const seconds = interaction.options.getInteger("delete_messages") ?? 0;

    const reason = interaction.options.getString("reason") || "-";

    const embeds: EmbedBuilder[] = [];

    if (members.size) {
      embeds.push(new EmbedBuilder()
        .setDescription(members.toJSON().join(" ").slice(0, 4096))
        .setFields([{
          name: t("banReason", interaction.locale),
          value: reason,
        }, {
          name: t("clearMessageHistory", interaction.locale),
          value: seconds ? ms(seconds * 1000) : "-",
        }])
        .setTitle(`${t("memberBanGroup", interaction.locale)} [${members.size}]`));
    }

    if (users.size) {
      embeds.push(new EmbedBuilder()
        .setDescription(users.toJSON().join(" ").slice(0, 4096))
        .setFields([{
          name: t("banReason", interaction.locale),
          value: reason,
        }, {
          name: t("clearMessageHistory", interaction.locale),
          value: seconds ? ms(seconds * 1000) : "-",
        }])
        .setTitle(`${t("userBanGroup", interaction.locale)} [${users.size}]`));
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
