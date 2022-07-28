import { EmbedBuilder, inlineCode, IntentsBitField, PermissionsBitField, SelectMenuInteraction } from 'discord.js';
import { SelectMenuComponentInteraction } from '../../structures';

export default class extends SelectMenuComponentInteraction {
  [x: string]: any;

  constructor() {
    super({
      name: 'bitfield',
      description: 'Bitfield of the specified rules.',
    });
  }

  async execute(interaction: SelectMenuInteraction) {
    const { customId } = interaction;

    const { sc, scg } = this.Util.JSONparse(customId) ?? {};

    return this[scg ?? sc]?.(interaction);
  }

  async intents(interaction: SelectMenuInteraction) {
    const { components, embeds } = this.#getBitFieldResponse(interaction, IntentsBitField, 'number');

    return interaction.update({ components, embeds });
  }

  async permissions(interaction: SelectMenuInteraction) {
    const { components, embeds } = this.#getBitFieldResponse(interaction, PermissionsBitField, 'bigint');

    return interaction.update({ components, embeds });
  }

  #getBitFieldResponse(
    interaction: SelectMenuInteraction,
    hold: (typeof IntentsBitField | typeof PermissionsBitField),
    type?: 'number' | 'bigint',
  ) {
    const { customId, locale, message, values } = interaction;

    const components = this.Util.setBitFieldValuesOnSelectMenus(message.components, values, customId);

    let bits: number | bigint = this.Util.calculateBitFieldFromSelectMenus(components);

    if (type === 'number') bits = Number(bits);

    const bitField = new hold(<any>bits);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const holds = bitField.toArray().map(x => `${this.t(x, { locale })}: ${inlineCode(`${hold.Flags[x]}`)}`);

    const num = Number(bitField.bitfield);

    const { sc, scg } = this.Util.JSONparse(customId) ?? {};

    return {
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(num > 0xffffff ? 0xffffff : num)
          .setTitle(`Bitfield of the ${scg ?? sc}.`)
          .setDescription(holds.join('\n') || null)
          .setFields({ name: `BitField [${holds.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      ],
    };
  }
}