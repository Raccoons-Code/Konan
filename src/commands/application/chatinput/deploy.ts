import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import commandHandler from "../../../handlers/CommandHandler";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      private: true,
      userPermissions: ["Administrator"],
    });

    this.data.setName("deploy")
      .setDescription("Deploy commands (Restricted for bot'owners).");
  }

  build() {
    this.data
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setNameLocalizations(getLocalizations("deployName"))
      .setDescriptionLocalizations(getLocalizations("deployDescription"))
      .addStringOption(option => option.setName("type")
        .setDescription("The type of deploy.")
        .setNameLocalizations(getLocalizations("deployTypeName"))
        .setDescriptionLocalizations(getLocalizations("deployTypeDescription"))
        .setChoices({
          name: "Global",
          value: "global",
          name_localizations: getLocalizations("Global"),
        }, {
          name: "Guild",
          value: "guild",
          name_localizations: getLocalizations("Guild"),
        })
        .setRequired(true))
      .addBooleanOption(option => option.setName("reset")
        .setDescription("Whether to reset the commands.")
        .setNameLocalizations(getLocalizations("deployResetName"))
        .setDescriptionLocalizations(getLocalizations("deployResetDescription")));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const locale = interaction.locale;

    const type = interaction.options.getString("type");
    const reset = interaction.options.getBoolean("reset");

    try {
      await commandHandler.register({
        global: type === "global",
        reset: Boolean(reset),
      });
    } catch (error) {
      await interaction.editReply(`${t(["reloadAppCommandsError", "type"], { locale })} ${type}`);
      throw error;
    }

    await interaction.editReply(`${t(["reloadedAppCommands", "type"], { locale })} ${type}`);
  }
}
