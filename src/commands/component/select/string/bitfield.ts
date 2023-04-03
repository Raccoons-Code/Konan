import { EmbedBuilder, inlineCode, IntentsBitField, PermissionsBitField, StringSelectMenuInteraction } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { calculateBitFieldFromSelectMenus, setBitFieldValuesOnSelectMenus } from "../../../../util/commands/components/selectmenu";

export default class extends SelectMenuCommand {
  [k: string]: any;

  constructor() {
    super({
      name: "bitfield",
    });
  }

  async execute(interaction: StringSelectMenuInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    await this[parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async intents(interaction: StringSelectMenuInteraction) {
    await interaction.update(this.#getBitFieldResponse(interaction, IntentsBitField, "number"));
    return;
  }

  async permissions(interaction: StringSelectMenuInteraction) {
    await interaction.update(this.#getBitFieldResponse(interaction, PermissionsBitField, "bigint"));
    return;
  }

  #getBitFieldResponse(
    interaction: StringSelectMenuInteraction,
    hold: typeof IntentsBitField | typeof PermissionsBitField,
    type?: "number" | "bigint",
  ) {
    const components = setBitFieldValuesOnSelectMenus(
      interaction.message.components,
      interaction.values,
      interaction.customId,
    );

    let bits: bigint | number = calculateBitFieldFromSelectMenus(components);

    if (type === "number") bits = Number(bits);

    const bitField = new hold(<any>bits);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const holds = bitField.toArray().map(x => `${t(x, interaction.locale)}: ${inlineCode(`${hold.Flags[x]}`)}`);

    let num = Number(bitField.bitfield);

    while (num > 0xffffff) {
      num -= 0xffffff;
    }

    const parsedId = JSON.parse(interaction.customId) ?? {};

    return {
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(num > 0xffffff ? 0xffffff : num)
          .setTitle(`Bitfield of the ${parsedId.scg ?? parsedId.sc}.`)
          .setDescription(holds.join("\n") || null)
          .setFields({ name: `BitField [${holds.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      ],
    };
  }
}
