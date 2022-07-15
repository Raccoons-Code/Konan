import { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, SelectMenuInteraction } from 'discord.js';
import { SelectMenuComponentInteraction } from '../../structures';

export default class extends SelectMenuComponentInteraction {
  [k: string]: any;

  constructor() {
    super({
      name: 'bitfield',
      description: 'Bitfield of the specified rules.',
    });
  }

  async execute(interaction: SelectMenuInteraction) {
    const { customId } = interaction;

    const { sc, scg } = this.Util.parseJSON(customId) ?? {};

    return this[scg ?? sc]?.(interaction);
  }

  async permissions(interaction: SelectMenuInteraction) {
    const { customId, locale, message, values } = interaction;

    const components = this.Util.setBitFieldValuesOnSelectMenus(message.components, values, customId);

    const bits = this.Util.calculateBitFieldFromSelectMenus(components);

    const permissionsBitField = new PermissionsBitField(bits);

    const permissions = permissionsBitField.toArray()
      .map(x => `${this.t(x, { locale })}: ${PermissionFlagsBits[x]}`);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bitfield of the permissions.')
        .setDescription(permissions.join('\n ') || null)
        .setFields({ name: `BitField [${permissions.length}]`, value: `${permissionsBitField.bitfield}` }),
    ];

    return interaction.update({ components, embeds });
  }
}