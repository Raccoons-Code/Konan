import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { ClearFiltersBitField } from "../../../../util/ClearMessages";
import { calculateBitFieldFromSelectMenus, setBitFieldValuesOnSelectMenus } from "../../../../util/commands/components/selectmenu";

export default class extends SelectMenuCommand {
  [k: string]: any;

  constructor() {
    super({
      name: "clear",
    });
  }

  async execute(interaction: StringSelectMenuInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await this[parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async filters(interaction: StringSelectMenuInteraction<"cached">) {
    const components = setBitFieldValuesOnSelectMenus(
      interaction.message.components,
      interaction.values,
      interaction.customId,
    );

    const bits = Number(calculateBitFieldFromSelectMenus(components));

    const bitField = new ClearFiltersBitField(bits);

    const holds = bitField.toArray().map(x => `${t(x, interaction.locale)}`);

    await interaction.update({
      components,
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setFields({
            name: `${t("clearFilters", interaction.locale)} [${holds.length}]`,
            value: holds.join("\n") || "-",
          }),
      ],
    });
  }
}
