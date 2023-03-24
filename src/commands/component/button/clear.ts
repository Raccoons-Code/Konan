import { ButtonInteraction, EmbedBuilder } from "discord.js";
import client from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import ClearMessages from "../../../util/ClearMessages";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "clear",
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    if (!interaction.channel?.isTextBased()) return;

    const locale = interaction.locale;

    const appPerms = interaction.channel.permissionsFor(client.user!)
      ?.missing(this.options.channelAppPermissions!);

    if (appPerms?.length) {
      await this.replyMissingPermission(interaction, appPerms, "missingChannelPermission");
      return 1;
    }

    const { amount, target } = JSON.parse(interaction.customId);

    await interaction.update({
      components: [],
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setTitle(`Trying to erase ${amount} messages...`),
      ],
    });

    const clearMessages = new ClearMessages({
      channel: interaction.channel,
      amount,
      targetMember: target,
    });

    try {
      await clearMessages.clear();
    } catch (error) {
      await interaction.editReply({
        content: t("messageDeleteError", { locale }),
        embeds: [],
      });
      throw error;
    }

    await interaction.editReply({
      content: t(clearMessages.cleared ? "messageDeleted" : "noDeletedMessages", {
        count: clearMessages.cleared,
        locale,
        size: clearMessages.cleared,
      }),
      embeds: [],
    });
    return;
  }
}
