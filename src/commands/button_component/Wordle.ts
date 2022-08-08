import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Wordle } from '../../modules/Wordle';
import { ButtonComponentInteraction } from '../../structures';

export default class extends ButtonComponentInteraction {
  [x: string]: any

  constructor() {
    super({
      name: 'wordle',
      description: 'Wordle game.',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId } = interaction;

    const { sc } = this.Util.JSONparse(customId) ?? {};

    return this[sc]?.(interaction);
  }

  async try(interaction: ButtonInteraction) {
    const wordleInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        messageId: interaction.message.id,
        players: {
          has: interaction.user.id,
        },
      },
    });

    if (!wordleInstance || wordleInstance?.quitters.includes(interaction.user.id))
      return interaction.deferUpdate();

    return interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: 'wordle', msgId: interaction.message.id }))
        .setTitle('Wordle')
        .setComponents([
          new ActionRowBuilder<TextInputBuilder>()
            .setComponents([
              new TextInputBuilder()
                .setCustomId('try')
                .setLabel('Try')
                .setMinLength(wordleInstance.data.word.length)
                .setMaxLength(wordleInstance.data.word.length)
                .setStyle(TextInputStyle.Short),
            ]),
        ]),
    );
  }

  async giveup(interaction: ButtonInteraction) {
    let wordleInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        messageId: interaction.message.id,
        players: {
          has: interaction.user.id,
        },
      },
    });

    if (!wordleInstance || wordleInstance?.quitters.includes(interaction.user.id))
      return interaction.deferUpdate();

    const playersId = this.Util.removeFromArray(wordleInstance.players, interaction.user.id);

    wordleInstance = await this.prisma.wordleInstance.update({
      where: {
        messageId: interaction.message.id,
      },
      data: {
        players: {
          set: playersId,
        },
        quitters: {
          push: interaction.user.id,
        },
        endedAt: playersId.length ? undefined : new Date(),
      },
    });

    if (!playersId.length) {
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle('Wordle game canceled by WO.')
            .setDescription(Wordle.transformToString(Wordle.transformToEmojis(<string[][]>wordleInstance.data.board)))
            .setFields([
              { name: 'The word was:', value: wordleInstance.data.word },
            ]),
        ],
        components: [],
      });
    }
  }

  async debug(interaction: ButtonInteraction) {
    const wordleInstances = await this.prisma.wordleInstance.findMany({
      where: {
        endedAt: {
          isSet: false,
        },
        players: {
          has: interaction.user.id,
        },
      },
    });

    const promises = [];

    for (let i = 0; i < wordleInstances.length; i++) {
      const wordleInstance = wordleInstances[i];

      const playersId = this.Util.removeFromArray(wordleInstance.players, interaction.user.id);

      promises.push(this.prisma.wordleInstance.update({
        data: {
          endedAt: playersId.length ? undefined : new Date(),
          players: {
            set: playersId,
          },
          quitters: {
            push: interaction.user.id,
          },
        },
        where: {
          messageId: wordleInstance.messageId,
        },
      })
        .catch(() => null));
    }

    const wordleInstancesUpdated = await Promise.all(promises);

    return interaction.update({
      content: `${wordleInstancesUpdated.filter(w => w).length} wordle games canceled.`,
      components: [],
    });
  }
}