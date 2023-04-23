import { ActionRowBuilder, AutoModerationActionType, AutoModerationRuleCreateOptions, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, codeBlock } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes } from "../../../util/automod";
import { getAddActionButton, getAllowListButton, getCancelButton, getEditNameButton, getEventsButton, getExemptChannelsButton, getExemptRolesButton, getKeywordFilterButton, getKeywordPresetsButton, getMentionTotalLimitButton, getRegexPatternsButton, getRemActionButton, getSuccessButton, getToggleButton, getTriggersButton } from "../../../util/commands/components/automodbutton";
import { configEmbedFields } from "../../../util/commands/embeds/automod";

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

    const subcommand = interaction.options.getSubcommandGroup() ??
      interaction.options.getSubcommand();

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
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            getEditNameButton(interaction.locale),
            getTriggersButton(interaction.locale),
            getEventsButton(interaction.locale),
            getAddActionButton(interaction.locale),
            getRemActionButton(interaction.locale),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            getSuccessButton(true),
            getCancelButton(),
            getToggleButton(interaction.locale),
            getExemptChannelsButton(interaction.locale),
            getExemptRolesButton(interaction.locale),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            getAllowListButton(interaction.locale, true),
            getKeywordFilterButton(interaction.locale, true),
            getKeywordPresetsButton(interaction.locale, true),
            getMentionTotalLimitButton(interaction.locale, true),
            getRegexPatternsButton(interaction.locale, true),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setDescription(codeBlock(`${t("required")} *`))
          .addFields(configEmbedFields[0].map(field => ({
            name: t(field.name, interaction.locale),
            value: field.value,
          }))),
        new EmbedBuilder()
          .setTitle(t("automodActions", interaction.locale))
          .addFields(configEmbedFields[1].map(field => ({
            name: t(field.name, interaction.locale),
            value: field.value,
          }))),
      ],
    });

    const _ = <AutoModerationRuleCreateOptions>{
      actions: [{
        type: AutoModerationActionType.BlockMessage,
        metadata: {
          channel: "",
          customMessage: null,
          durationSeconds: null,
        },
      }, {
        type: AutoModerationActionType.SendAlertMessage,
        metadata: {
          channel: "",
          customMessage: null,
          durationSeconds: null,
        },
      }, {
        type: AutoModerationActionType.Timeout,
        metadata: {
          channel: "",
          customMessage: null,
          durationSeconds: null,
        },
      }],
      eventType: AutoModerationRuleEventType.MessageSend,
      name: "automod 1",
      triggerType: AutoModerationRuleTriggerType.Keyword,
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
    };

    return;
  }
}

/*
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
*/
