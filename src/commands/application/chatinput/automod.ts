import { AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
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
        type: AutoModerationActionType.BlockMessage,
        metadata: {
          channel: "",
          customMessage: "",
          durationSeconds: 1,
        },
      }],
      eventType: AutoModerationRuleEventType.MessageSend,
      name: "",
      triggerType: AutoModerationRuleTriggerType.Spam,
      enabled: true,
      exemptChannels: [],
      exemptRoles: [],
      reason: "",
      triggerMetadata: {
        allowList: [],
        keywordFilter: [],
        mentionTotalLimit: 1,
        presets: [
          AutoModerationRuleKeywordPresetType.Profanity,
          AutoModerationRuleKeywordPresetType.SexualContent,
          AutoModerationRuleKeywordPresetType.Slurs,
        ],
        regexPatterns: [],
      },
    });
  }
}
