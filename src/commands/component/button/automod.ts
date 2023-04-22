import { ActionRowBuilder, AutoModerationActionType, ButtonInteraction, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import { getActionTypes, getAvailableTriggerTypes, getEventTypes, getKeywordPresetTypes } from "../../../util/automod";
import { getAddActionsSelectOptions, getEventsSelectOptions, getKeywordPresetsSelectOptions, getTriggersSelectOptions } from "../../../util/commands/components/automodselect";
import { editButtonById } from "../../../util/commands/components/button";
import { addSelectMenuByType, addSelectOptionsToRows, removeSelectMenuById } from "../../../util/commands/components/selectmenu";
import { componentsHasRowById } from "../../../util/commands/components/utils";
import { configEmbedFields } from "../../../util/commands/embeds/automod";
import { getEmbedFields, getSelectOptionsFromEmbedFields } from "../../../util/commands/embeds/utils";

export default class extends ButtonCommand {
  readonly nonDefer = ["editName", "setAllowList", "setKeywordFilter", "setMentionTotalLimit", "setRegexPatterns"];

  constructor() {
    super({
      name: "automod",
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    const subcommand = <"execute">parsedId.scg ?? parsedId.sc;

    if (!this.nonDefer.includes(subcommand))
      await interaction.deferUpdate();

    await this[subcommand]?.(interaction);

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    await interaction.deleteReply();
  }

  async addAction(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "addAction",
      a: ComponentType.StringSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 4 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components, [
          customId,
          JSON.stringify({
            c: "automod",
            sc: "setSendAlertMessageAction",
            a: AutoModerationActionType.SendAlertMessage,
          }),
          JSON.stringify({
            c: "automod",
            sc: "setTimeoutAction",
            a: AutoModerationActionType.Timeout,
          }),
        ]) :
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getAddActionsSelectOptions(getActionTypes(), interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
    });
  }

  async remAction(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "remAction",
      a: ComponentType.StringSelect,
    });

    if (interaction.message.components.length === 5 ||
      componentsHasRowById(
        interaction.message.components,
        customId,
      )) {
      await interaction.editReply({
        components: removeSelectMenuById(
          interaction.message.components,
          customId,
        ),
      });
      return;
    }

    const embedsCollection = getEmbedFields(
      interaction.message.embeds, {
      names: configEmbedFields[1].flatMap(field => [
        `ON - ${t(field.name)}`,
        `ON - ${t(field.name, interaction.locale)}`,
      ]),
    });

    const embedFields = embedsCollection.get(1);

    if (!embedFields?.size) return;

    await interaction.editReply({
      components: addSelectOptionsToRows(
        interaction.message.components,
        customId,
        getSelectOptionsFromEmbedFields(embedFields), {
        distinct: false,
        maxOptions: embedFields.size,
      }),
    });
  }

  async editName(interaction: ButtonInteraction<"cached">) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "automod", sc: "editName" }))
        .setTitle("Automod")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("name")
                .setLabel(t("automodEditName", interaction.locale))
                .setRequired(true)
                .setStyle(TextInputStyle.Short),
            ]),
      ),
    );
  }

  async setAllowList(interaction: ButtonInteraction<"cached">) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "automod", sc: "setAllowList" }))
        .setTitle("Automod")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("allowList")
                .setLabel(t("automodAllowList", interaction.locale))
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ),
    );
  }

  async setKeywordFilter(interaction: ButtonInteraction<"cached">) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "automod", sc: "setKeywordFilter" }))
        .setTitle("Automod")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("keywordFilter")
                .setLabel(t("automodKeywordFilter", interaction.locale))
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ),
    );
  }

  async setKeywordPresets(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setKeywordPresets",
      a: ComponentType.StringSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 5 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components,
          customId,
        ) :
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getKeywordPresetsSelectOptions(getKeywordPresetTypes(), interaction.locale), {
          distinct: false,
          maxOptions: 25,
        }),
    });
  }

  async setMentionTotalLimit(interaction: ButtonInteraction<"cached">) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "automod", sc: "setMentionTotalLimit" }))
        .setTitle("Automod")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("mentionTotalLimit")
                .setLabel(t("automodMentionTotalLimit", interaction.locale))
                .setMaxLength(2)
                .setRequired(true)
                .setStyle(TextInputStyle.Short),
            ]),
        ),
    );
  }

  async setRegexPatterns(interaction: ButtonInteraction<"cached">) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "automod", sc: "setRegexPatterns" }))
        .setTitle("Automod")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("regexPatterns")
                .setLabel(t("automodRegexPatterns", interaction.locale))
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ),
    );
  }

  async setExemptChannels(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setExemptChannels",
      a: ComponentType.ChannelSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 5 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components,
          customId,
        ) :
        addSelectMenuByType(
          ComponentType.ChannelSelect,
          customId,
          interaction.message.components, {
          distinct: false,
        }),
    });
  }

  async setExemptRoles(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setExemptRoles",
      a: ComponentType.RoleSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 5 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components,
          customId,
        ) :
        addSelectMenuByType(
          ComponentType.RoleSelect,
          customId,
          interaction.message.components, {
          distinct: false,
        }),
    });
  }

  async setEventType(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setEventType",
      a: ComponentType.StringSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 5 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components,
          customId,
        ) :
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getEventsSelectOptions(getEventTypes(), interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
    });
  }

  async setTriggerType(interaction: ButtonInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggers = getAvailableTriggerTypes(rules.values());

    if (!availableTriggers.length) {
      await interaction.editReply(t("automodHasMaxRules", interaction.locale));
      return 1;
    }

    const customId = JSON.stringify({
      c: "automod",
      sc: "setTriggerType",
      a: ComponentType.StringSelect,
    });

    await interaction.editReply({
      components: interaction.message.components.length === 5 ||
        componentsHasRowById(
          interaction.message.components,
          customId,
        ) ?
        removeSelectMenuById(
          interaction.message.components,
          customId,
        ) :
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getTriggersSelectOptions(availableTriggers, interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
    });

    return;
  }

  async toggle(interaction: ButtonInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await interaction.editReply({
      components: editButtonById(
        interaction.message.components,
        interaction.customId, {
        custom_id: JSON.stringify({ ...parsedId, a: !parsedId.a }),
        name: parsedId.a ? t("activated") : t("disabled"),
        style: parsedId.a ? ButtonStyle.Success : ButtonStyle.Danger,
      }),
    });
  }
}
