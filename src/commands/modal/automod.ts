import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import ModalSubmit from "../../structures/ModalSubmit";
import { t } from "../../translator";


export default class extends ModalSubmit {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: ModalSubmitInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"execute">parsedId.scg ?? parsedId.sc]?.(interaction);

    return;
  }

  async addAction(interaction: ModalSubmitInteraction<"cached">) {
    const message = interaction.fields.getTextInputValue("message");

    const [, embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(1, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(0, 1, {
          name: `ON - ${t("BlockMessage", interaction.locale)}`,
          value: message || " ",
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async editName(interaction: ModalSubmitInteraction<"cached">) {
    const name = interaction.fields.getTextInputValue("name");

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .setTitle(name),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async setAllowList(interaction: ModalSubmitInteraction<"cached">) {
    const allowListString = interaction.fields.getTextInputValue("allowList");

    const allowList = allowListString.split(/[,\r\n]+/);

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(4, 1, {
          name: t("automodAllowList", interaction.locale),
          value: allowList.join(","),
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async setKeywordFilter(interaction: ModalSubmitInteraction<"cached">) {
    const keywordFilterString = interaction.fields.getTextInputValue("keywordFilter");

    const keywordFilter = keywordFilterString.split(/[,\r\n]+/);

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(5, 1, {
          name: t("automodKeywordFilter", interaction.locale),
          value: keywordFilter.join(","),
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async setMentionTotalLimit(interaction: ModalSubmitInteraction<"cached">) {
    const mentionTotalLimit = Number(interaction.fields.getTextInputValue("mentionTotalLimit"));

    if (isNaN(mentionTotalLimit) || mentionTotalLimit > 50) {
      return 1;
    }

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(6, 1, {
          name: t("automodMentionTotalLimit", interaction.locale),
          value: `${mentionTotalLimit}`,
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async setRegexPatterns(interaction: ModalSubmitInteraction<"cached">) {
    const regexPatternsString = interaction.fields.getTextInputValue("regexPatterns");

    const regexPatterns = regexPatternsString.split(/[\r\n]+/);

    const invalidPatterns = [];
    for (let i = 0; i < regexPatterns.length; i++) {
      const pattern = regexPatterns[i];
      try {
        RegExp(pattern);
      } catch {
        regexPatterns.splice(i, 1);
        invalidPatterns.push(pattern);
        i--;
      }
    }

    if (invalidPatterns.length) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("invalidRegexPatterns", interaction.locale))
            .setDescription(invalidPatterns.join("\n")),
        ],
        ephemeral: true,
      });
    }

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(8, 1, {
          name: t("automodRegexPatterns", interaction.locale),
          value: regexPatterns.join("\n"),
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }
}
