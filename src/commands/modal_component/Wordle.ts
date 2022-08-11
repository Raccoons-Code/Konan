import { EmbedBuilder, inlineCode, ModalSubmitInteraction } from 'discord.js';
import { dictionaries } from '../../modules/Dictionaries';
import { Wordle } from '../../modules/Wordle';
import { ModalSubmit } from '../../structures';

export default class extends ModalSubmit {
  [x: string]: any

  constructor() {
    super({
      name: 'wordle',
      description: 'The game of wordle.',
    });
  }

  async execute(interaction: ModalSubmitInteraction) {
    const { fields, locale, message, user } = interaction;

    const userAttempt = fields.getTextInputValue('try');

    if (!await dictionaries.hasAsync(locale, userAttempt))
      return interaction.reply({
        content: `${inlineCode(userAttempt)} was not found in the dictionary.`,
        ephemeral: true,
      });

    interaction.deferUpdate();

    const wordleInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        endedAt: {
          isSet: false,
        },
        messageId: message?.id,
      },
    });

    if (!wordleInstance) return;

    const { board, lose, win } =
      Wordle.check(wordleInstance.data.word, userAttempt, <string[][]>wordleInstance.data.board);

    await this.prisma.wordleInstance.update({
      where: {
        messageId: message?.id,
      },
      data: {
        data: {
          update: {
            board,
          },
        },
        endedAt: (win || lose) ? new Date() : undefined,
        winner: win ? user.id : undefined,
      },
    });

    const embeds = [
      new EmbedBuilder()
        .setColor(win ? 'Green' : lose ? 'Red' : 'Blue')
        .setDescription(Wordle.transformToString(Wordle.transformToEmojis(board)))
        .setTitle(win ? `${user.username} won!` : lose ? `${user.username} lost!` : 'Wordle'),
    ];

    if (lose)
      embeds[0]
        .setFields([
          { name: 'The word was:', value: inlineCode(wordleInstance.data.word) },
        ]);

    message?.edit({
      components: (win || lose) ? [] : message.components,
      embeds,
    });
  }
}