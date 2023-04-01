import { EmbedBuilder, inlineCode, ModalSubmitInteraction, userMention } from "discord.js";
import prisma from "../../database/prisma";
import { dictionaries } from "../../modules/Dictionaries";
import wordle from "../../modules/Wordle";
import ModalSubmit from "../../structures/ModalSubmit";
import { t } from "../../translator";

export default class extends ModalSubmit {
  constructor() {
    super({
      name: "wordle",
    });
  }

  async execute(interaction: ModalSubmitInteraction) {
    const locale = interaction.locale;

    const userAttempt = interaction.fields.getTextInputValue("try");

    if (!await dictionaries.hasAsync(locale, userAttempt)) {
      await interaction.reply({
        content: t("wordOnDictionary404", {
          locale,
          word: inlineCode(userAttempt),
        }),
        ephemeral: true,
      });
      return 1;
    }

    await interaction.deferUpdate();

    const wordleInstance = await prisma.wordleInstance.findFirst({
      where: {
        endedAt: {
          isSet: false,
        },
        messageId: interaction.message?.id,
      },
    });

    if (!wordleInstance) return;

    const { board, lose, win } =
      wordle.check(
        wordleInstance.data.word,
        userAttempt,
        <string[][]>wordleInstance.data.board,
      );

    await prisma.wordleInstance.update({
      where: {
        messageId: interaction.message?.id,
      },
      data: {
        data: {
          update: {
            board,
          },
        },
        endedAt: (win || lose) ? new Date() : undefined,
        winner: win ? interaction.user.id : undefined,
      },
    });

    const players = wordleInstance.players.map(player => userMention(player));

    const embeds = [
      new EmbedBuilder()
        .setColor(win ? "Green" : lose ? "Red" : "Blue")
        .setDescription(wordle.transformToString(wordle.transformToEmojis(board)))
        .setTitle(win ? `${interaction.user.username} won!` :
          lose ? `${interaction.user.username} lost!` : "Wordle")
        .setFields([
          players.length > 1 ? [
            {
              name: `Players [${players.length}]`,
              value: `${players.splice(0, 10).join("\n")}`
                + `\n${players.length ?
                  `...and ${inlineCode(`${players.length}`)} more` :
                  ""}`,
            },
          ] : [],
          lose ? [
            {
              name: "The word was:",
              value: inlineCode(wordleInstance.data.word),
            },
          ] : [],
        ].flat()),
    ];

    await interaction.message?.edit({
      components: (win || lose) ? [] : interaction.message.components,
      embeds,
    });

    return;
  }
}
