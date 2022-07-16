import { EmbedBuilder, GatewayIntentBits, inlineCode, IntentsBitField, PermissionFlagsBits, PermissionsBitField, SelectMenuInteraction } from 'discord.js';
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

  async intents(interaction: SelectMenuInteraction) {
    const { customId, locale, message, values } = interaction;

    const components = this.Util.setBitFieldValuesOnSelectMenus(message.components, values, customId);

    const bits = this.Util.calculateBitFieldFromSelectMenus(components);

    const bitField = new IntentsBitField(Number(bits));

    const intents = bitField.toArray()
      .map(x => `${this.t(x, { locale })}: ${inlineCode(`${GatewayIntentBits[x]}`)}`);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bitfield of the intents.')
        .setDescription(intents.join('\n') || null)
        .setFields({ name: `BitField [${intents.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
    ];

    return interaction.update({ components, embeds });
  }

  async permissions(interaction: SelectMenuInteraction) {
    const { customId, locale, message, values } = interaction;

    const components = this.Util.setBitFieldValuesOnSelectMenus(message.components, values, customId);

    const bits = this.Util.calculateBitFieldFromSelectMenus(components);

    const bitField = new PermissionsBitField(bits);

    const permissions = bitField.toArray()
      .map(x => `${this.t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bitfield of the permissions.')
        .setDescription(permissions.join('\n') || null)
        .setFields({ name: `BitField [${permissions.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
    ];

    return interaction.update({ components, embeds });
  }
}