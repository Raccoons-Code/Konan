import { ActionRowBuilder, AutoModerationRuleCreateOptions, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes } from "../../../util/automod";
import { getAddActionButton, getCancelButton, getEditNameButton, getEventsButton, getExemptChannelsButton, getExemptRolesButton, getRemActionButton, getSuccessButton, getTriggersButton } from "../../../util/commands/components/automodbutton";
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
            getExemptChannelsButton(interaction.locale),
            getExemptRolesButton(interaction.locale),
          ]),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            getSuccessButton(),
            getCancelButton(),
            getAddActionButton(interaction.locale),
            getRemActionButton(interaction.locale),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .addFields(configEmbedFields[0].map(field => ({
            name: t(field.name, interaction.locale),
            value: field.value,
          }))),
        new EmbedBuilder()
          .setTitle("Automod Actions")
          .addFields(configEmbedFields[1].map(field => ({
            name: t(field.name, interaction.locale),
            value: field.value,
          }))),
      ],
    });

    const _ = <AutoModerationRuleCreateOptions>{};

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
