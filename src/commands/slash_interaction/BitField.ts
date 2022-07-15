import { APIRole, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, PermissionsString, Role, SelectMenuOptionBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const permissionsString = <PermissionsString[]>Object.keys(PermissionFlagsBits);

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
          .setDescription('Role to get the permissions from.')));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() || options.getSubcommand();

    return this[subcommand]?.(interaction);
  }

  async permissions(interaction: ChatInputCommandInteraction) {
    const { locale, options } = interaction;

    const role = options.getRole('role');

    if (role) return this.permissionsForRole(interaction, role);

    const permissionsOptions = permissionsString.map((key) =>
      new SelectMenuOptionBuilder().setLabel(this.t(key, { locale }))
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

    const permissionsBitField = new PermissionsBitField(<PermissionsBitField>role.permissions);

    const permissions = permissionsBitField.toArray()
      .map(x => `${this.t(x, { locale })}: ${PermissionFlagsBits[x]}`);

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bitfield of the permissions.')
        .setDescription(permissions.join('\n ') || null)
        .setFields({ name: `BitField [${permissions.length}]`, value: `${permissionsBitField.bitfield}` }),
    ];

    return interaction.editReply({ embeds });
  }
}