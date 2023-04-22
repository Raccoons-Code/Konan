import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import MessageContextCommand from "../../../../structures/MessageContextCommand";
import { t } from "../../../../translator";
import { ClearFiltersBitField, ClearFiltersBits, clearFiltersFlags } from "../../../../util/ClearMessages";
import { createSelectFromOptions } from "../../../../util/commands/components/selectmenu";
import { getLocalizations } from "../../../../util/utils";

export default class extends MessageContextCommand {
  constructor() {
    super({
      channelAppPermissions: ["ManageMessages", "ReadMessageHistory"],
      channelUserPermissions: ["ManageMessages"],
    });

    this.data.setName("Clear up to here");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("clearUpToHereName"))
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }

  async execute(interaction: MessageContextMenuCommandInteraction<"cached">) {
    if (!interaction.channel?.isTextBased()) return;

    await interaction.deferReply({ ephemeral: true });

    const locale = interaction.locale;

    const messages = await interaction.channel.messages.fetch({
      after: interaction.targetMessage.id,
      limit: 100,
    }).catch(() => null);

    if (!messages) {
      await interaction.editReply(t("noMessagesFound", interaction.locale));
      return 1;
    }

    const clearFilter = new ClearFiltersBitField(ClearFiltersBitField.Default);

    const holds = clearFilter.toArray().map(x => `${t(x, interaction.locale)}`);

    const clearOptions = clearFiltersFlags
      .map((key) => new StringSelectMenuOptionBuilder()
        .setEmoji(clearFilter.has(key) ? "✅" : "❌")
        .setLabel(`${t(key, interaction.locale)}`)
        .setValue(JSON.stringify({
          n: `${ClearFiltersBits[key]}`,
          v: clearFilter.has(key) ? 1 : 0,
        })));

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setFields({
            name: `${t("clearFilters", interaction.locale)} [${holds.length}]`,
            value: holds.join("\n") || "-",
          })
          .setTitle(t("messageDeleteConfirm", {
            count: messages.size + 1,
            locale,
            size: messages.size === 100 ?
              `${messages.size}+` :
              messages.size + 1,
          })),
      ],
      components: [
        ...createSelectFromOptions(clearOptions, JSON.stringify({
          c: "clear",
          sc: "filters",
        }), {
          placeholder: `♻️ ${t("clearFilters", interaction.locale)}`,
        }),
        new ActionRowBuilder<UserSelectMenuBuilder>()
          .addComponents(new UserSelectMenuBuilder()
            .setCustomId(JSON.stringify({
              c: "clear",
              sc: "users",
            }))
            .setMaxValues(25)
            .setMinValues(0)
            .setPlaceholder(`🚸 ${t("targetUsers", interaction.locale)}`)),
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "clear_context",
                msgId: interaction.targetMessage.id,
              }))
              .setEmoji("🚮")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });

    return;
  }
}
