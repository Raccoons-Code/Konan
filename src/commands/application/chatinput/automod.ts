import { AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";

export default class extends ChatInputCommand {
  constructor() {
    super({
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });

    this.data.setName("automod")
      .setDescription("Setup automod system");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand(subcommand => subcommand.setName("create")
        .setDescription("Create automod rule"));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    interaction.guild.autoModerationRules.create({
      actions: [{
        type: AutoModerationActionType.SendAlertMessage,
      }],
      eventType: AutoModerationRuleEventType.MessageSend,
      name: "",
      triggerType: AutoModerationRuleTriggerType.Spam,
      enabled: true,
      
    });
  }
}
