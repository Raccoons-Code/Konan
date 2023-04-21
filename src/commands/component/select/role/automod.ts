import { EmbedBuilder, RoleSelectMenuInteraction } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { removeSelectMenuById } from "../../../../util/commands/components/selectmenu";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: RoleSelectMenuInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"setExemptRoles">parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async setExemptRoles(interaction: RoleSelectMenuInteraction<"cached">) {
    const [embed] = interaction.message.embeds;

    await interaction.editReply({
      components: removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
      ),
      embeds: [
        new EmbedBuilder(embed.toJSON())
          .spliceFields(3, 1, {
            name: t("automodFieldExemptRoles", interaction.locale),
            value: interaction.roles.toJSON().join(" ") || "-",
          }),
      ],
    });
  }
}
