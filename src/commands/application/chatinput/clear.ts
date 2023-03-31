import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits, StringSelectMenuOptionBuilder, userMention } from "discord.js";
import client from "../../../client";
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
        .setNameLocalizations(getLocalizations("clearAmountOptionName"))
        .setDescriptionLocalizations(getLocalizations("clearAmountOptionDescription"))
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true))
      .addChannelOption(option => option.setName("channel")
        .setDescription("Select a channel to clear.")
        .setNameLocalizations(getLocalizations("clearChannelOptionName"))
        .setDescriptionLocalizations(getLocalizations("clearChannelOptionDescription"))
        .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
      .addStringOption(option => option.setName("users")
        .setDescription("Mention targets to delete messages."));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const channel = <GuildTextBasedChannel>interaction.options.getChannel("channel") ?? interaction.channel;

    const appPerms = channel.permissionsFor(client.user!)
      ?.missing(this.options.channelAppPermissions!);

    if (appPerms?.length) {
      await this.replyMissingPermission(interaction, appPerms, "missingChannelPermission");
      return 1;
    }

    const locale = interaction.locale;

    const amount = interaction.options.getInteger("amount", true);

    const ids = Array.from(new Set(interaction.options.getString("users")
      ?.match(/\d{17,}/g)))
      ?.map(id => userMention(id));

    const clearFilter = new ClearFiltersBitField(ClearFiltersBitField.Default);

    const holds = clearFilter.toArray().map(x => t(x, { locale }));

    const clearOptions = clearFiltersFlags
      .map((key) => new StringSelectMenuOptionBuilder()
        .setEmoji(clearFilter.has(key) ? "✅" : "❌")
        .setLabel(`${t(key, { locale })}`)
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
            name: `${t("clearFilters", { locale })} [${holds.length}]`,
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
          placeholder: `♻️ ${t("clearFilters", { locale })}`,
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
