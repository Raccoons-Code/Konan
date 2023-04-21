import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes } from "../../../util/automod";
import { getTriggersSelectOptions } from "../../../util/commands/components/automodselect";

export default class extends ChatInputCommand {
  constructor() {
    super({
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
      private: true, // Development
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
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommandGroup() ?? interaction.options.getSubcommand();

    await this[<"create">subcommand]?.(interaction);

    return;
  }

  async create(interaction: ChatInputCommandInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggers = getAvailableTriggerTypes(rules.values());

    if (!availableTriggers.length) {
      await interaction.editReply(t("automodHasMaxRules", interaction.locale));
      return 1;
    }

    await interaction.editReply({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(new StringSelectMenuBuilder()
            .setCustomId(JSON.stringify({
              c: "automod",
              sc: "setTriggerType",
            }))
            .setPlaceholder("Set the trigger type.")
            .addOptions(getTriggersSelectOptions(availableTriggers, interaction))),
      ],
      embeds: [
        new EmbedBuilder()
          .setTitle("Automod Setup"),
      ],
    });

    return;
  }
}

    /* interaction.guild.autoModerationRules.create({
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
    }); */
