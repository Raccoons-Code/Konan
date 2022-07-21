import { ChatInputCommandInteraction, EmbedBuilder, GatewayIntentBits, GatewayIntentsString, GuildMember, inlineCode, IntentsBitField, PermissionFlagsBits, PermissionsBitField, PermissionsString, Role, SelectMenuOptionBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const permissionsString = <PermissionsString[]>Object.keys(PermissionFlagsBits);
const intentsBitField = new IntentsBitField(<GatewayIntentsString[]>Object.keys(GatewayIntentBits));
const intentsString = intentsBitField.toArray();

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
          .setDescription('Role to get the permissions from.'))
        .addUserOption(option => option.setName('user')
          .setDescription('User to get the permissions from.'))
        .addStringOption(option => option.setName('bits')
          .setDescription('Permissions to get the bitfield of.')))
      .addSubcommand(subcommand => subcommand.setName('intents')
        .setDescription('Bitfield of the intents.')
        .addStringOption(option => option.setName('bits')
          .setDescription('Intents to get the bitfield of.')));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const { options } = interaction;

    const subcommand = options.getSubcommandGroup() || options.getSubcommand();

    return this[subcommand]?.(interaction);
  }

  async intents(interaction: ChatInputCommandInteraction) {
    const { locale, options } = interaction;

    const bits = options.getString('bits');

    if (bits) return this.intentsForBits(interaction, { bits });

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

  async intentsForBits(interaction: ChatInputCommandInteraction, Intents: IntentsOptions) {
    const { locale } = interaction;

    const { bits } = Intents;

    const embeds = <EmbedBuilder[]>[];

    if (bits) {
      const bitField = new IntentsBitField(<any[]>bits.split(',').map(bit => isNaN(+bit) ? bit : Number(bit)));

      if (bitField.bitfield > intentsBitField.bitfield)
        bitField.bitfield = intentsBitField.bitfield;

      const intents = bitField.toArray()
        .map(x => `${this.t(x, { locale })}: ${inlineCode(`${GatewayIntentBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor('Random')
          .setTitle('Bitfield of the intents.')
          .setDescription(intents.join('\n') || null)
          .setFields({ name: `BitField [${intents.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      );
    }

    return interaction.editReply({ embeds });
  }

  async permissions(interaction: ChatInputCommandInteraction) {
    const { locale, options } = interaction;

    const role = <Role>options.getRole('role');
    const member = <GuildMember>options.getMember('user');
    const bits = <string>options.getString('bits');

    if (role || member || bits) return this.permissionsForMention(interaction, { role, member, bits });

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

  async permissionsForMention(interaction: ChatInputCommandInteraction, mentions: MentionsOptions) {
    const { locale } = interaction;

    const { role, member, bits } = mentions;

    const embeds = <EmbedBuilder[]>[];

    if (role) {
      const bitField = new PermissionsBitField(<PermissionsBitField>role.permissions);

      const permissions = bitField.toArray()
        .map(x => `${this.t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor('Random')
          .setTitle(`Bitfield of the role ${role.name} permissions.`)
          .setDescription(permissions.join('\n') || null)
          .setFields({ name: `BitField [${permissions.length}]`, value: `${inlineCode(`${bitField.bitfield}`)}` }),
      );
    }

    if (member) {
      const bitField = new PermissionsBitField(<PermissionsBitField>member.permissions);

      const permissions = bitField.toArray()
        .map(x => `${this.t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor('Random')
          .setTitle(`Bitfield of the user ${member.displayName} permissions.`)
          .setDescription(permissions.join('\n') || null)
          .setFields({ name: `BitField [${permissions.length}]`, value: `${inlineCode(`${bitField.bitfield}`)}` }),
      );
    }

    if (bits) {
      const bitField = new PermissionsBitField(<any[]>bits.split(',').map(bit => isNaN(+bit) ? bit : BigInt(bit)));

      if (bitField.bitfield > PermissionsBitField.All)
        bitField.bitfield = PermissionsBitField.All;

      const intents = bitField.toArray()
        .map(x => `${this.t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor('Random')
          .setTitle('Bitfield of the intents.')
          .setDescription(intents.join('\n') || null)
          .setFields({ name: `BitField [${intents.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      );
    }

    return interaction.editReply({ embeds });
  }
}

interface MentionsOptions {
  role?: Role;
  member?: GuildMember;
  bits?: string;
}

interface IntentsOptions {
  bits?: string;
}