import { ChatInputCommandInteraction, EmbedBuilder, GatewayIntentBits, GuildMember, inlineCode, IntentsBitField, PermissionFlagsBits, PermissionsBitField, Role, StringSelectMenuOptionBuilder } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { createSelectMenuFromOptions } from "../../../util/commands/components/selectmenu";
import { INTENTS_STRING, PERMISSIONS_STRING } from "../../../util/constants";

export default class extends ChatInputCommand {
  [x: string]: any;

  constructor() {
    super({
      category: "Utility",
    });

    this.data.setName("bitfield")
      .setDescription("Bitfield of the specified rules.");
  }

  build() {
    this.data
      .addSubcommand(subcommand => subcommand.setName("permissions")
        .setDescription("Bitfield of the permissions.")
        .addRoleOption(option => option.setName("role")
          .setDescription("Role to get the permissions from."))
        .addUserOption(option => option.setName("user")
          .setDescription("User to get the permissions from."))
        .addStringOption(option => option.setName("bits")
          .setDescription("Permissions to get the bitfield of.")))
      .addSubcommand(subcommand => subcommand.setName("intents")
        .setDescription("Bitfield of the intents.")
        .addStringOption(option => option.setName("bits")
          .setDescription("Intents to get the bitfield of.")));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const subcommand = interaction.options.getSubcommandGroup() || interaction.options.getSubcommand();

    await this[subcommand]?.(interaction);

    return;
  }

  async intents(interaction: ChatInputCommandInteraction) {
    const locale = interaction.locale;

    const bits = interaction.options.getString("bits");

    if (bits) return this.intentsForBits(interaction, { bits });

    const intentsOptions = INTENTS_STRING
      .map((key) => new StringSelectMenuOptionBuilder()
        .setEmoji("❌")
        .setLabel(`${t(key, { locale })} #${GatewayIntentBits[key]}`)
        .setValue(JSON.stringify({ n: `${GatewayIntentBits[key]}`, v: 0 })));

    await interaction.editReply({
      components: createSelectMenuFromOptions(intentsOptions, {
        c: "bitfield",
        sc: "intents",
      }),
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setTitle("Bitfield of the intents."),
      ],
    });

    return;
  }

  async intentsForBits(interaction: ChatInputCommandInteraction, Intents: IntentsOptions) {
    const locale = interaction.locale;

    const embeds = <EmbedBuilder[]>[];

    if (Intents.bits) {
      const bitField = new IntentsBitField(<any[]>Intents.bits.split(",").map(bit => isNaN(+bit) ? bit : Number(bit)));

      const intents = bitField.toArray()
        .map(x => `${t(x, { locale })}: ${inlineCode(`${GatewayIntentBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor("Random")
          .setTitle("Bitfield of the intents.")
          .setDescription(intents.join("\n") || null)
          .setFields({ name: `BitField [${intents.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      );
    }

    await interaction.editReply({ embeds });
    return;
  }

  async permissions(interaction: ChatInputCommandInteraction) {
    const locale = interaction.locale;

    const role = <Role>interaction.options.getRole("role");
    const member = <GuildMember>interaction.options.getMember("user");
    const bits = <string>interaction.options.getString("bits");

    if (role || member || bits) return this.permissionsForMention(interaction, { role, member, bits });

    const permissionsOptions = PERMISSIONS_STRING.map((key) =>
      new StringSelectMenuOptionBuilder().setEmoji("❌")
        .setLabel(`${t(key, { locale })} #${PermissionFlagsBits[key]}`)
        .setValue(JSON.stringify({ n: `${PermissionFlagsBits[key]}`, v: 0 })));

    const permissionsRows = createSelectMenuFromOptions(permissionsOptions, {
      c: "bitfield",
      sc: "permissions",
    });

    await interaction.editReply({
      components: permissionsRows,
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setTitle("Bitfield of the permissions."),
      ],
    });

    return;
  }

  async permissionsForMention(interaction: ChatInputCommandInteraction, mentions: MentionsOptions) {
    const locale = interaction.locale;

    const embeds = <EmbedBuilder[]>[];

    if (mentions.role) {
      const bitField = new PermissionsBitField(<PermissionsBitField>mentions.role.permissions);

      const permissions = bitField.toArray()
        .map(x => `${t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor("Random")
          .setTitle(`Bitfield of the role ${mentions.role.name} permissions.`)
          .setDescription(permissions.join("\n") || null)
          .setFields({ name: `BitField [${permissions.length}]`, value: `${inlineCode(`${bitField.bitfield}`)}` }),
      );
    }

    if (mentions.member) {
      const bitField = new PermissionsBitField(<PermissionsBitField>mentions.member.permissions);

      const permissions = bitField.toArray()
        .map(x => `${t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor("Random")
          .setTitle(`Bitfield of the user ${mentions.member.displayName} permissions.`)
          .setDescription(permissions.join("\n") || null)
          .setFields({ name: `BitField [${permissions.length}]`, value: `${inlineCode(`${bitField.bitfield}`)}` }),
      );
    }

    if (mentions.bits) {
      const bitField = new PermissionsBitField(<any[]>mentions.bits.split(/\D+/g)
        .map(bit => isNaN(+bit) ? bit : BigInt(bit)));

      if (bitField.bitfield > PermissionsBitField.All)
        bitField.bitfield = PermissionsBitField.All;

      const intents = bitField.toArray()
        .map(x => `${t(x, { locale })}: ${inlineCode(`${PermissionFlagsBits[x]}`)}`);

      embeds.push(
        new EmbedBuilder()
          .setColor("Random")
          .setTitle("Bitfield of the intents.")
          .setDescription(intents.join("\n") || null)
          .setFields({ name: `BitField [${intents.length}]`, value: inlineCode(`${bitField.bitfield}`) }),
      );
    }

    await interaction.editReply({ embeds });
    return;
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
