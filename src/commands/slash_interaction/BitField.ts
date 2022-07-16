import { APIRole, ChatInputCommandInteraction, EmbedBuilder, GatewayIntentBits, GatewayIntentsString, inlineCode, IntentsBitField, PermissionFlagsBits, PermissionsBitField, PermissionsString, Role, SelectMenuOptionBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const permissionsString = <PermissionsString[]>Object.keys(PermissionFlagsBits);
const intentsString = new IntentsBitField(<GatewayIntentsString[]>Object.keys(GatewayIntentBits)).toArray();

export default class BitField extends SlashCommand {
  [k: string]: any;

  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('bitfield')
      .setDescription('Bitfield of the specified rules.')
      .addSubcommand(subcommand => subcommand.setName('permissions')
        .setDescription('Bitfield of the permissions.')
        .addRoleOption(option => option.setName('role')
          .setDescription('Role to get the permissions from.')))
      .addSubcommand(subcommand => subcommand.setName('intents')
        .setDescription('Bitfield of the intents.'));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() || options.getSubcommand();

    return this[subcommand]?.(interaction);
  }

  async intents(interaction: ChatInputCommandInteraction) {
    const { locale } = interaction;

    const intentsOptions = intentsString.map((key) =>
      new SelectMenuOptionBuilder().setEmoji('❌')
        .setLabel(`${this.t(key, { locale })} #${GatewayIntentBits[key]}`)
        .setValue(JSON.stringify({ n: `${GatewayIntentBits[key]}`, v: 0 })));

    const intentsRows = this.Util.createSelectMenusFromOptions(intentsOptions, {
      c: 'bitfield',
      sc: 'intents',
    });

    return interaction.editReply({
      components: intentsRows,
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setTitle('Bitfield of the intents.'),
      ],
    });
  }

  async permissions(interaction: ChatInputCommandInteraction) {
    const { locale, options } = interaction;

    const role = options.getRole('role');

    if (role) return this.permissionsForRole(interaction, role);

    const permissionsOptions = permissionsString.map((key) =>
      new SelectMenuOptionBuilder().setEmoji('❌')
        .setLabel(`${this.t(key, { locale })} #${PermissionFlagsBits[key]}`)
        .setValue(JSON.stringify({ n: `${PermissionFlagsBits[key]}`, v: 0 })));

    const permissionsRows = this.Util.createSelectMenusFromOptions(permissionsOptions, {
      c: 'bitfield',
      sc: 'permissions',
    });

    return interaction.editReply({
      components: permissionsRows,
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setTitle('Bitfield of the permissions.'),
      ],
    });
  }

  async permissionsForRole(interaction: ChatInputCommandInteraction, role: Role | APIRole) {
    const { locale } = interaction;

    const bitField = new PermissionsBitField(<PermissionsBitField>role.permissions);

    const permissions = bitField.toArray()
      .map(x => `${this.t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bitfield of the permissions.')
        .setDescription(permissions.join('\n') || null)
        .setFields({ name: `BitField [${permissions.length}]`, value: `${inlineCode(`${bitField.bitfield}`)}` }),
    ];

    return interaction.editReply({ embeds });
  }
}