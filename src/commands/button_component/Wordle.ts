import { WordleInstance } from '@prisma/client';
import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, inlineCode, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
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
    const oldInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        messageId: interaction.message.id,
        players: {
          has: interaction.user.id,
        },
      },
    });

    if (!oldInstance || oldInstance?.quitters.includes(interaction.user.id))
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
                .setMinLength(oldInstance.data.word.length)
                .setMaxLength(oldInstance.data.word.length)
                .setStyle(TextInputStyle.Short),
            ]),
        ]),
    );
  }

  async giveupOldInstance(interaction: ButtonInteraction) {
    const oldInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        userId: interaction.user.id,
        endedAt: {
          isSet: false,
        },
      },
    });

    if (!oldInstance)
      return interaction.deferUpdate();

    const playersId = this.Util.removeFromArray(oldInstance.players, interaction.user.id);

    await this.prisma.wordleInstance.update({
      where: {
        messageId: oldInstance.messageId,
      },
      data: {
        endedAt: playersId.length ? undefined : new Date(),
        userId: playersId[0],
        players: {
          set: playersId,
        },
        quitters: {
          push: interaction.user.id,
        },
      },
    });

    if (!playersId.length) this.#giveupByMessageId(interaction, oldInstance);

    return interaction.update({
      content: 'Wordle game canceled.',
      components: [],
    });
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
        userId: interaction.user.id === wordleInstance.userId ? playersId[0] : wordleInstance.userId,
        players: {
          set: playersId,
        },
        quitters: {
          push: interaction.user.id,
        },
        endedAt: playersId.length ? undefined : new Date(),
      },
    });

    if (!playersId.length)
      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle('Wordle game canceled by WO.')
            .setFields([
              { name: 'The word was:', value: inlineCode(wordleInstance.data.word) },
            ]),
        ],
        components: [],
      });
  }

  async debug(interaction: ButtonInteraction) {
    const oldInstances = await this.prisma.wordleInstance.findMany({
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

    for (let i = 0; i < oldInstances.length; i++) {
      const wordleInstance = oldInstances[i];

      const playersId = this.Util.removeFromArray(wordleInstance.players, interaction.user.id);

      promises.push(this.prisma.wordleInstance.update({
        data: {
          endedAt: playersId.length ? undefined : new Date(),
          userId: interaction.user.id === wordleInstance.userId ? playersId[0] : wordleInstance.userId,
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
        .then(data => {
          this.#giveupByMessageId(interaction, data);
          return data;
        })
        .catch(() => null));
    }

    const wordleInstancesUpdated = await Promise.all(promises);

    return interaction.update({
      content: `${wordleInstancesUpdated.filter(w => w).length} wordle games canceled.`,
      components: [],
    });
  }

  async #giveupByMessageId(interaction: ButtonInteraction, data: WordleInstance) {
    if (!data.channelId) return;

    const channel = await interaction.client.channels.fetch(data.channelId);
    if (!channel?.isTextBased()) return;

    const message = await channel.messages.safeFetch(data.messageId);
    if (!message) return;

    const embedJson = message.embeds[0].toJSON();

    const embeds = [
      new EmbedBuilder(embedJson)
        .setColor(data.endedAt ? 'DarkRed' : embedJson.color ?? 'Random')
        .setDescription(data.endedAt ? null : `${embedJson.description}`)
        .setFields([
          data.players.length > 1 ? [
            {
              name: `Players [${data.players.length}]`,
              value: `${data.players.splice(0, 10).join('\n')}\n${data.players.length ?
                `...and ${inlineCode(`${data.players.length}`)} more` :
                ''}`,
            },
          ] : [],
          data.endedAt ? [
            { name: 'The word was:', value: inlineCode(data.data.word) },
          ] : [],
        ].flat()),
    ];

    try {
      await message.edit({
        components: data.endedAt ? [] : message.components,
        embeds,
      });
    } catch { null; }
  }
}