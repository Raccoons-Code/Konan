import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits } from "discord.js";
import client from "../../../../client";
import MessageContextCommand from "../../../../structures/MessageContextCommand";
import { t } from "../../../../translator";
import ClearMessages from "../../../../util/ClearMessages";
import { getLocalizations } from "../../../../util/utils";

export default class extends MessageContextCommand {
  constructor() {
    super({
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });

    this.data.setName("Clear up to here");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("clearUpToHereName"))
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }

  async execute(interaction: MessageContextMenuCommandInteraction<"cached">) {
    if (!interaction.channel?.isTextBased()) return;

    await interaction.deferReply({ ephemeral: true });

    const locale = interaction.locale;

    const appPerms = interaction.channel.permissionsFor(client.user!)
      ?.missing(this.options.channelAppPermissions!);

    if (appPerms?.length) {
      await this.replyMissingPermission(interaction, appPerms, "missingChannelPermission");
      return 1;
    }

    const messages = await interaction.channel.messages.fetch({
      after: interaction.targetMessage.id,
      limit: 100,
    }).catch(() => null);

    messages?.sweep(msg => ClearMessages.messageIsOld(msg));

    if (!messages?.size) {
      await interaction.editReply(t("noMessagesFound", { locale }));
      return 1;
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setTitle(t("messageDeleteConfirm", {
            count: messages.size + 1,
            locale,
            size: messages.size === 100 ?
              `${messages.size}+` :
              messages.size + 1,
          })),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "clear_context",
                msgId: interaction.targetMessage.id,
              }))
              .setEmoji("🚮")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });

    return;
  }
}
