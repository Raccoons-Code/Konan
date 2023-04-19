import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits, StringSelectMenuOptionBuilder, userMention } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { ClearFiltersBitField, ClearFiltersBits, clearFiltersFlags } from "../../../util/ClearMessages";
import { createSelectMenuFromOptions } from "../../../util/commands/components/selectmenu";
import { GUILD_TEXT_CHANNEL_TYPES } from "../../../util/constants";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Moderation",
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });

    this.data.setName("clear")
      .setDescription("Deletes up to 1000 channel messages at once.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setNameLocalizations(getLocalizations("clearName"))
      .setDescriptionLocalizations(getLocalizations("clearDescription"))
      .addIntegerOption(option => option.setName("amount")
        .setDescription("The amount of messages to delete.")
        .setNameLocalizations(getLocalizations("clearAmountName"))
        .setDescriptionLocalizations(getLocalizations("clearAmountDescription"))
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName("channel")
        .setDescription("Select a channel to clear.")
        .setNameLocalizations(getLocalizations("clearChannelName"))
        .setDescriptionLocalizations(getLocalizations("clearChannelDescription"))
        .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
      .addStringOption(option => option.setName("users")
        .setDescription("Mention targets to delete messages.")
        .setNameLocalizations(getLocalizations("clearUsersName"))
        .setDescriptionLocalizations(getLocalizations("clearUsersDescription")));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const channel = <GuildTextBasedChannel>interaction.options.getChannel("channel") ?? interaction.channel;

    const locale = interaction.locale;

    const amount = interaction.options.getInteger("amount", true);

    const ids = Array.from(new Set(interaction.options.getString("users")
      ?.match(/\d{17,}/g)))
      ?.map(id => userMention(id));

    const clearFilter = new ClearFiltersBitField(ClearFiltersBitField.Default);

    const holds = clearFilter.toArray().map(x => t(x, interaction.locale));

    const clearOptions = clearFiltersFlags
      .map((key) => new StringSelectMenuOptionBuilder()
        .setEmoji(clearFilter.has(key) ? "✅" : "❌")
        .setLabel(t(key, interaction.locale))
        .setValue(JSON.stringify({
          n: `${ClearFiltersBits[key]}`,
          v: clearFilter.has(key),
        })));

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setDescription(ids?.length ? `Target: ${ids?.join(" ")}` : null)
          .setFields({
            name: `${t("clearFilters", interaction.locale)} [${holds.length}]`,
            value: holds.join("\n") || "-",
          })
          .setTitle(t("messageDeleteConfirm", {
            count: amount,
            locale,
            size: amount,
          })),
      ],
      components: [
        ...createSelectMenuFromOptions(clearOptions, {
          c: "clear",
          sc: "filters",
        }, {
          placeholder: `♻️ ${t("clearFilters", interaction.locale)}`,
        }),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "clear",
                sc: "clear",
                amount,
                channel: channel.id,
              }))
              .setEmoji("🚮")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });

    return;
  }
}
