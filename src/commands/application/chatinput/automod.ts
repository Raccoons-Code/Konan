import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, codeBlock } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes } from "../../../util/automod";
import { getAddActionButton, getAllowListButton, getCancelButton, getEditButtonsByTrigger, getEditNameButton, getEventsButton, getExemptChannelsButton, getExemptRolesButton, getKeywordFilterButton, getKeywordPresetsButton, getMentionTotalLimitButton, getRegexPatternsButton, getRemActionButton, getSuccessButton, getToggleButton, getTriggersButton } from "../../../util/commands/components/automodbutton";
import { configEmbedFields, getEmbedFieldsFromRule } from "../../../util/commands/embeds/automod";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
      private: true, // Development
    });

    this.data.setName("automod")
      .setDescription("Setup automod system.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .setNameLocalizations(getLocalizations("automodName"))
      .setDescriptionLocalizations(getLocalizations("automodDescription"))
      .addSubcommand(subcommand => subcommand.setName("create")
        .setDescription("Create automod rule.")
        .setNameLocalizations(getLocalizations("automodCreateName"))
        .setDescriptionLocalizations(getLocalizations("automodCreateDescription")))
      .addSubcommand(subcommand => subcommand.setName("edit")
        .setDescription("Edit automod rule.")
        .setNameLocalizations(getLocalizations("automodEditName"))
        .setDescriptionLocalizations(getLocalizations("automodEditDescription"))
        .addStringOption(option => option.setName("rule")
          .setDescription("Select a rule.")
          .setNameLocalizations(getLocalizations("automodEditRuleName"))
          .setDescriptionLocalizations(getLocalizations("automodEditRuleDescription"))
          .setAutocomplete(true)
          .setRequired(true)))
      .addSubcommand(subcommand => subcommand.setName("delete")
        .setDescription("Delete automod rule.")
        .setNameLocalizations(getLocalizations("automodDeleteName"))
        .setDescriptionLocalizations(getLocalizations("automodDeleteDescription"))
        .addStringOption(option => option.setName("rule")
          .setDescription("Select a rule.")
          .setNameLocalizations(getLocalizations("automodDeleteRuleName"))
          .setDescriptionLocalizations(getLocalizations("automodDeleteRuleDescription"))
          .setAutocomplete(true)
          .setRequired(true)));
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
          .setDescription(codeBlock(`${t("automodHelpText", interaction.locale)}\n\n${t("required", interaction.locale)} *`))
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

    return;
  }

  async edit(interaction: ChatInputCommandInteraction<"cached">) {
    const ruleId = interaction.options.getString("rule")!;

    const rule = interaction.guild.autoModerationRules.cache.get(ruleId);

    if (!rule) {
      await interaction.editReply(t("automodRule404", interaction.locale));
      return 1;
    }

    const embeds = getEmbedFieldsFromRule(rule, interaction.locale);

    await interaction.editReply({
      components: getEditButtonsByTrigger(rule.triggerType, interaction.locale, rule.enabled)
        .map(buttons => new ActionRowBuilder<ButtonBuilder>()
          .addComponents(buttons)),
      embeds: [
        new EmbedBuilder(embeds[0])
          .setDescription(codeBlock(`${t("automodHelpText", interaction.locale)}\n\n${t("required", interaction.locale)} *`))
          .setFooter({
            text: rule.id,
          }),
        new EmbedBuilder(embeds[1])
          .setTitle(t("automodActions", interaction.locale)),
      ],
    });
  }

  async delete(interaction: ChatInputCommandInteraction<"cached">) {
    const ruleId = interaction.options.getString("rule")!;

    const rule = interaction.guild.autoModerationRules.cache.get(ruleId);

    if (!rule) {
      await interaction.editReply(t("automodRule404", interaction.locale));
      return 1;
    }

    const embeds = getEmbedFieldsFromRule(rule, interaction.locale);

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: "automod", sc: "delete" }))
              .setEmoji("🚮")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
      content: t("automodConfirmDelete", interaction.locale),
      embeds: [
        new EmbedBuilder(embeds[0])
          .setFooter({
            text: rule.id,
          }),
        new EmbedBuilder(embeds[1])
          .setTitle(t("automodActions", interaction.locale)),
      ],
    });
  }
}
