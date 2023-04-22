import { ActionRowBuilder, ButtonInteraction, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import { getActionTypes, getAvailableTriggerTypes, getEventTypes } from "../../../util/automod";
import { getAddActionsSelectOptions, getEventsSelectOptions, getTriggersSelectOptions } from "../../../util/commands/components/automodselect";
import { toggleButtons } from "../../../util/commands/components/button";
import { addSelectMenuByType, addSelectOptionsToRows, removeSelectByType } from "../../../util/commands/components/selectmenu";
import { componentsHasRowType } from "../../../util/commands/components/utils";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "automod",
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    const subcommand = <"execute">parsedId.scg ?? parsedId.sc;

    if (!["editName"].includes(subcommand))
      await interaction.deferUpdate();

    await this[subcommand]?.(interaction);

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    await interaction.deleteReply();
  }

  async addAction(interaction: ButtonInteraction<"cached">) {
    await interaction.editReply({
      components: toggleButtons(
        addSelectOptionsToRows(
          interaction.message.components,
          JSON.stringify({
            c: "automod",
            sc: "addAction",
            a: ComponentType.StringSelect,
          }),
          getAddActionsSelectOptions(getActionTypes(), interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
        JSON.stringify({ c: "automod", sc: "addAction" }),
        true,
      ),
    });
  }

  async remAction(interaction: ButtonInteraction<"cached">) {

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

  async setExemptChannels(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setExemptChannels",
      a: ComponentType.StringSelect,
    });

    const hasMenu = componentsHasRowType(
      interaction.message.components,
      ComponentType.ChannelSelect,
    );

    await interaction.editReply({
      components: hasMenu ?
        removeSelectByType(
          interaction.message.components,
          ComponentType.ChannelSelect,
        ) :
        addSelectMenuByType(
          ComponentType.ChannelSelect,
          customId,
          interaction.message.components,
        ),
    });
  }

  async setExemptRoles(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({
      c: "automod",
      sc: "setExemptRoles",
      a: ComponentType.StringSelect,
    });

    const hasMenu = componentsHasRowType(
      interaction.message.components,
      ComponentType.RoleSelect,
    );

    await interaction.editReply({
      components: hasMenu ?
        removeSelectByType(
          interaction.message.components,
          ComponentType.RoleSelect,
        ) :
        addSelectMenuByType(
          ComponentType.RoleSelect,
          customId,
          interaction.message.components,
        ),
    });
  }

  async setEventType(interaction: ButtonInteraction<"cached">) {
    await interaction.editReply({
      components: toggleButtons(
        addSelectOptionsToRows(
          interaction.message.components,
          JSON.stringify({
            c: "automod",
            sc: "setEventType",
            a: ComponentType.StringSelect,
          }),
          getEventsSelectOptions(getEventTypes(), interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
        JSON.stringify({
          c: "automod",
          sc: "setEventType",
        }),
        true,
      ),
    });
  }

  async setTriggerType(interaction: ButtonInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggers = getAvailableTriggerTypes(rules.values());

    if (!availableTriggers.length) {
      await interaction.editReply(t("automodHasMaxRules", interaction.locale));
      return 1;
    }

    await interaction.editReply({
      components: toggleButtons(
        addSelectOptionsToRows(
          interaction.message.components,
          JSON.stringify({
            c: "automod",
            sc: "setTriggerType",
            a: ComponentType.StringSelect,
          }),
          getTriggersSelectOptions(availableTriggers, interaction.locale), {
          distinct: false,
          maxOptions: 1,
        }),
        JSON.stringify({
          c: "automod",
          sc: "setTriggerType",
        }),
        true,
      ),
    });

    return;
  }
}
