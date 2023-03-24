import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import client from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
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
      .addUserOption(option => option.setName("member")
        .setDescription("Target member to clear messages"));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = <GuildTextBasedChannel>interaction.options.getChannel("channel") ?? interaction.channel;

    const appPerms = channel.permissionsFor(client.user!)
      ?.missing(this.options.channelAppPermissions!);

    if (appPerms?.length) {
      await this.replyMissingPermission(interaction, appPerms, "missingChannelPermission");
      return 1;
    }

    const locale = interaction.locale;

    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger("amount", true);

    const target = interaction.options.getMember("member");

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setTitle(t("messageDeleteConfirm", {
            count: amount,
            locale,
            size: amount,
          })),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "clear",
                amount,
                target,
              }))
              .setEmoji("🚮")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });

    return;
  }
}
