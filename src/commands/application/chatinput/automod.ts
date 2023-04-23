import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, codeBlock } from "discord.js";
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
}
