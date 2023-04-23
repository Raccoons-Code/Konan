import { ActionRowBuilder, AutoModerationActionType, ComponentType, EmbedBuilder, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { AutomodEnumOptionValue } from "../../../../@types";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import ParseMs from "../../../../util/ParseMs";
import { TriggerTypeString, getAvailableTriggerTypes } from "../../../../util/automod";
import { automodSuccessButtonCustomId, automodToggleButtonsByTrigger } from "../../../../util/commands/components/automodbutton";
import { getTriggersSelectOptions } from "../../../../util/commands/components/automodselect";
import { toggleButtons } from "../../../../util/commands/components/button";
import { addSelectMenuByType, addSelectOptionsToRows, getTimesSelectOptions, removeSelectByType, removeSelectMenuById, setSelectMenuOptions } from "../../../../util/commands/components/selectmenu";
import { componentsHasRowById, componentsHasRowType } from "../../../../util/commands/components/utils";
import { configEmbedFields, embedsHasRequiredFieldsByTrigger } from "../../../../util/commands/embeds/automod";
import { getEmbedFields } from "../../../../util/commands/embeds/utils";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: StringSelectMenuInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    const subcommand = <"execute">parsedId?.scg ?? parsedId?.sc;

    if (!["addAction"].includes(subcommand))
      await interaction.deferUpdate();

    await this[subcommand]?.(interaction);

    return;
  }

  async addAction(interaction: StringSelectMenuInteraction<"cached">) {
    const [value] = interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    switch (<AutoModerationActionType>parsedValue.bit) {
      case AutoModerationActionType.BlockMessage:
        await interaction.showModal(
          new ModalBuilder()
            .setCustomId(JSON.stringify({
              c: "automod",
              sc: "addAction",
              a: AutoModerationActionType.BlockMessage,
            }))
            .setTitle("Automod Action")
            .addComponents(
              new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                  new TextInputBuilder()
                    .setCustomId("message")
                    .setLabel("Custom Message")
                    .setMaxLength(150)
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph),
                ),
            ),
        );
        break;

      case AutoModerationActionType.SendAlertMessage: {
        if (!componentsHasRowType(
          interaction.message.components,
          ComponentType.ChannelSelect,
        )) {
          await interaction.update({
            components: addSelectMenuByType(
              ComponentType.ChannelSelect,
              JSON.stringify({
                c: "automod",
                sc: "setSendAlertMessageAction",
                a: AutoModerationActionType.SendAlertMessage,
              }),
              removeSelectMenuById(
                interaction.message.components,
                JSON.stringify({
                  c: "automod",
                  sc: "setTimeoutAction",
                  a: AutoModerationActionType.Timeout,
                }),
              ), {
              maxOptions: 1,
              distinct: false,
            }),
          });
        }
        break;
      }

      case AutoModerationActionType.Timeout: {
        const customId = JSON.stringify({
          c: "automod",
          sc: "setTimeoutAction",
          a: AutoModerationActionType.Timeout,
        });

        if (!componentsHasRowById(
          interaction.message.components,
          customId,
        )) {
          await interaction.update({
            components: removeSelectByType(
              addSelectOptionsToRows(
                interaction.message.components,
                customId,
                getTimesSelectOptions(interaction.locale), {
                distinct: false,
                maxOptions: 1,
              }),
              ComponentType.ChannelSelect,
            ),
          });
        }
        break;
      }
    }
  }

  async remAction(interaction: StringSelectMenuInteraction<"cached">) {
    const embedsCollection = getEmbedFields(
      interaction.message.embeds, {
      namePatterns: interaction.values.map(value =>
        RegExp(`^${JSON.parse(value).n}`)),
    });

    const fields = embedsCollection.get(1);

    const customId = JSON.stringify({
      c: "automod",
      sc: "remAction",
      a: ComponentType.StringSelect,
    });

    if (!fields?.size) {
      await interaction.editReply({
        components: removeSelectMenuById(
          interaction.message.components,
          customId,
        ),
      });
      return 1;
    }

    const [, oldEmbed] = interaction.message.embeds;

    const newEmbed = new EmbedBuilder(oldEmbed.toJSON());

    for (const [i] of fields) {
      interaction.message.embeds.splice(1, 1,
        <any>newEmbed
          .spliceFields(i, 1, {
            name: t(configEmbedFields[1][i].name, interaction.locale),
            value: configEmbedFields[1][i].value,
          }),
      );
    }

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(removeSelectMenuById(
        interaction.message.components,
        customId,
      ),
      automodSuccessButtonCustomId,
      !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }

  async setTimeoutAction(interaction: StringSelectMenuInteraction<"cached">) {
    const [value] = interaction.values;

    const parsedValue = JSON.parse(value);

    const [, embed] = interaction.message.embeds;

    interaction.message.embeds.splice(1, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(2, 1, {
          name: `ON - ${t("Timeout", interaction.locale)}`,
          value: `${parsedValue.ms ? new ParseMs(parsedValue.ms) : " "}`,
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(removeSelectMenuById(
        interaction.message.components, [
        interaction.customId,
      ]),
      automodSuccessButtonCustomId,
      !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }

  async setKeywordPresets(interaction: StringSelectMenuInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setKeywordPresets",
      a: ComponentType.StringSelect,
    });

    const [embed] = interaction.message.embeds;

    interaction.message.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(7, 1, {
          name: t("automodKeywordPresets", interaction.locale),
          value: interaction.values.flatMap(value => {
            const parsedValue = JSON.parse(value);
            return `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`;
          }).join("\n"),
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(removeSelectMenuById(
        interaction.message.components,
        customId,
      ),
      automodSuccessButtonCustomId,
      !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }

  async setEventType(interaction: StringSelectMenuInteraction<"cached">) {
    const [value] = interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    const [embed] = interaction.message.embeds;

    interaction.message.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(1, 1, {
          name: t("automodEventType", interaction.locale),
          value: `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`,
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
      ),
        automodSuccessButtonCustomId,
        !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }

  async setTriggerType(interaction: StringSelectMenuInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggerTypes = getAvailableTriggerTypes(rules.values());

    if (!availableTriggerTypes.length) {
      await interaction.editReply({
        components: [],
        content: t("automodHasMaxRules", interaction.locale),
        embeds: [],
      });
      return 1;
    }

    const [value] = interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    if (!availableTriggerTypes.includes(<TriggerTypeString>parsedValue.type)) {
      await Promise.all([
        interaction.editReply({
          components: setSelectMenuOptions(
            interaction.message.components,
            interaction.customId,
            getTriggersSelectOptions(availableTriggerTypes, interaction.locale),
          ),
        }),
        interaction.followUp({
          content: t("automodHasMaxRulesFor", {
            locale: interaction.locale,
            value: t(parsedValue.type, interaction.locale),
          }),
          ephemeral: true,
        }),
      ]);
      return 1;
    }

    const [embed] = interaction.message.embeds;

    interaction.message.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(0, 1, {
          name: t("automodTriggerType", interaction.locale),
          value: `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`,
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(toggleButtons(toggleButtons(removeSelectMenuById(
        interaction.message.components,
        interaction.customId),
        automodToggleButtonsByTrigger[<1>parsedValue.bit].enable,
        false),
        automodToggleButtonsByTrigger[<1>parsedValue.bit].disable,
        true),
        automodSuccessButtonCustomId,
        !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }
}
