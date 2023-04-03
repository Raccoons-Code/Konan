import { ActionRowBuilder, APIEmbedField, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, inlineCode, OAuth2Scopes, RouteBases, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { env } from "node:process";
import client from "../../../client";
import commandHandler from "../../../handlers/CommandHandler";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getLocalizations, mathRandom } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "General",
    });

    this.data.setName("help")
      .setDescription("Show the help message.");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("helpName"))
      .setDescriptionLocalizations(getLocalizations("helpDescription"))
      .addStringOption(option => option.setName("command")
        .setDescription("The command to show the help message for.")
        .setNameLocalizations(getLocalizations("helpCommandName"))
        .setDescriptionLocalizations(getLocalizations("helpCommandDescription"))
        .setAutocomplete(true));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const commandName = interaction.options.getString("command");

    if (commandName) {
      await this.command(interaction, commandName);
      return;
    }

    const locale = interaction.locale;

    const me = interaction.guild?.members.me ?? client.user;

    const avatarURL = me?.displayAvatarURL() || null;

    const buttons = [
      new ButtonBuilder()
        .setEmoji("📮") // :postbox:
        .setLabel(t("inviteLink", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(client.generateInvite({
          scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
          permissions: commandHandler.permissions,
        })),
    ];

    if (env.GUILD_INVITE)
      buttons.push(new ButtonBuilder()
        .setEmoji("🪤") // :mouse_trap:
        .setLabel(t("supportServer", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(`${RouteBases.invite}/${env.GUILD_INVITE}`));

    if (env.DONATE_LINK)
      buttons.push(new ButtonBuilder()
        .setEmoji("💸") // :money_with_wings:
        .setLabel(t("donate", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(env.DONATE_LINK));

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(new StringSelectMenuBuilder()
            .setCustomId(JSON.stringify({ c: this.data.name }))
            .setOptions(
              new StringSelectMenuOptionBuilder()
                .setDefault(true)
                .setEmoji("🏠")
                .setLabel("Home")
                .setValue("home"),
              new StringSelectMenuOptionBuilder()
                .setEmoji("🗃️")
                .setLabel("Commands")
                .setValue("commands"),
              new StringSelectMenuOptionBuilder()
                .setEmoji(["🌎", "🌏", "🌍"][mathRandom(3)])
                .setLabel("Languages")
                .setValue("localization"),
            )),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            t("helpText", {
              locale,
              user: interaction.user,
            })
            + "\n\n"
            + "[Terms of Service & Privacy](https://github.com/Raccoons-Code/Konan/wiki/Terms-of-Service-&-Privacy)",
          )
          .setThumbnail(avatarURL)
          .setTitle(t("konanSupport", interaction.locale)),
      ],
    });

    return;
  }

  async command(interaction: ChatInputCommandInteraction, commandName: string) {
    const slashCommands = commandHandler.chatInputApplicationCommands;

    const command = slashCommands.get(commandName);

    if (!command) {
      await interaction.editReply(t("command404", interaction.locale));
      return 1;
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setDescription(`${command}`)
          .setFields(this.convertCommandOptionsToEmbedFields(command))
          .setTitle(command.data.description),
      ],
    });

    return;
  }

  convertCommandOptionsToEmbedFields(command: ChatInputCommand) {
    const fields: APIEmbedField[] = [];

    const dataJson = command.data.toJSON();

    if (!dataJson.options?.length) return fields;

    for (const data of dataJson.options) {
      fields.push({
        name: data.description.slice(0, 256),
        value: "options" in data && data.options ?
          this.convertOptionsToString(command, data.options, data).slice(0, 1024) :
          `> ${command.getCommandMention(data.name)}`,
      });
    }

    return fields;
  }

  convertOptionsToString(
    command: ChatInputCommand,
    dataOptions: any[],
    subGroup: any,
    subCommand?: any,
    text = "",
    index = "",
  ) {
    if ((subCommand ?? subGroup).type === ApplicationCommandOptionType.Subcommand) {
      text += command.getCommandMention(subGroup.name, subCommand?.name) + "\n";
    }

    for (const data of dataOptions) {
      text += [
        data.type > 2 ? `> ${inlineCode(data.name)}` : "",
        data.autocomplete ? " | `Autocomplete`" : "",
        data.required ? " | `Required`" : "",
        "\n",
      ].join("");

      if (data.options) {
        text = this.convertOptionsToString(command, data.options, subGroup, data, text, index + "- ");
      }
    }

    return text;
  }
}
