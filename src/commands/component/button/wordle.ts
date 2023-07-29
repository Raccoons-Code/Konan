import { Wordle } from "@prisma/client";
import { ActionRowBuilder, ButtonInteraction, Colors, EmbedBuilder, inlineCode, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import prisma from "../../../database/prisma";
import wordle from "../../../modules/Wordle";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "wordle",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"try">parsedId.sc]?.(interaction);

    return;
  }

  async try(interaction: ButtonInteraction) {
    const oldInstance = await prisma.wordle.findFirst({
      where: {
        message_id: interaction.message.id,
        players: {
          has: interaction.user.id,
        },
      },
    });

    if (!oldInstance || oldInstance?.quitters.includes(interaction.user.id)) {
      await interaction.deferUpdate();
      return 1;
    }

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "wordle", msgId: interaction.message.id }))
        .setTitle("Wordle")
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("try")
                .setLabel("Try")
                .setMinLength(oldInstance.data.word.length)
                .setMaxLength(oldInstance.data.word.length)
                .setPlaceholder(wordle.getUpperLetters(<string[][]>oldInstance.data.board).join(" "))
                .setStyle(TextInputStyle.Short),
            ]),
        ]),
    );

    return;
  }

  async giveupOldInstance(interaction: ButtonInteraction) {
    let oldInstance = await prisma.wordle.findFirst({
      where: {
        user_id: interaction.user.id,
        ended_at: {
          isSet: false,
        },
      },
    });

    if (!oldInstance) {
      await interaction.deferUpdate();
      return 1;
    }

    const playersId = oldInstance.players.filter(id => id !== interaction.user.id);

    oldInstance = await prisma.wordle.update({
      where: {
        message_id: oldInstance.message_id,
      },
      data: {
        ended_at: playersId.length ? undefined : new Date(),
        user_id: playersId[0],
        players: {
          set: playersId,
        },
        quitters: {
          push: interaction.user.id,
        },
      },
    });

    const promises = [];

    if (!playersId.length) {
      promises.push(this.#giveupByMessageId(interaction, oldInstance));
    }

    promises.push(interaction.update({
      content: "Wordle game canceled.",
      components: [],
    }));

    await Promise.all(promises);

    return;
  }

  async giveup(interaction: ButtonInteraction) {
    const wordleInstance = await prisma.wordle.findFirst({
      where: {
        message_id: interaction.message.id,
        players: {
          has: interaction.user.id,
        },
      },
    });

    if (!wordleInstance || wordleInstance.quitters.includes(interaction.user.id)) {
      await interaction.deferUpdate();
      return 1;
    }

    const playersId = wordleInstance.players.filter(id => id !== interaction.user.id);

    const promises: Promise<unknown>[] = [];

    promises.push(prisma.wordle.update({
      where: {
        message_id: interaction.message.id,
      },
      data: {
        user_id: interaction.user.id === wordleInstance.user_id ? playersId[0] : wordleInstance.user_id,
        players: {
          set: playersId,
        },
        quitters: {
          push: interaction.user.id,
        },
        ended_at: playersId.length ? undefined : new Date(),
      },
    }));

    if (playersId.length) {
      promises.push(interaction.deferUpdate());
    } else {
      promises.push(interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.DarkRed)
            .setTitle("Wordle game canceled by WO.")
            .setFields([
              { name: "The word was:", value: inlineCode(wordleInstance.data.word) },
            ]),
        ],
        components: [],
      }));
    }

    await Promise.all(promises);

    return;
  }

  async debug(interaction: ButtonInteraction) {
    const oldInstances = await prisma.wordle.findMany({
      where: {
        ended_at: {
          isSet: false,
        },
        players: {
          has: interaction.user.id,
        },
      },
    });

    const promises = [];

    for (const instance of oldInstances) {
      const playersId = instance.players.filter(id => id !== interaction.user.id);

      promises.push(prisma.wordle.update({
        data: {
          ended_at: playersId.length ? undefined : new Date(),
          user_id: interaction.user.id === instance.user_id ? playersId[0] : instance.user_id,
          players: {
            set: playersId,
          },
          quitters: {
            push: interaction.user.id,
          },
        },
        where: {
          message_id: instance.message_id,
        },
      })
        .then(data => {
          this.#giveupByMessageId(interaction, data);
          return data;
        })
        .catch(() => null));
    }

    const wordleInstancesUpdated = await Promise.all(promises);

    await interaction.update({
      content: `${wordleInstancesUpdated.filter(w => w).length} wordle games canceled.`,
      components: [],
    });

    return;
  }

  async #giveupByMessageId(interaction: ButtonInteraction, data: Wordle) {
    if (!data.channel_id) return;

    const channel = await interaction.client.channels.fetch(data.channel_id);
    if (!channel?.isTextBased()) return;

    const message = await channel.messages.fetch(data.message_id).catch(() => null);
    if (!message) return;

    const embedJson = message.embeds[0].toJSON();

    const embeds = [
      new EmbedBuilder(embedJson)
        .setColor(data.ended_at ? "DarkRed" : embedJson.color ?? "Random")
        .setDescription(data.ended_at ? null : `${embedJson.description}`)
        .setFields([
          data.players.length > 1 ? [
            {
              name: `Players [${data.players.length}]`,
              value: `${data.players.splice(0, 10).join("\n")}`
                + `\n${data.players.length ?
                  `...and ${inlineCode(`${data.players.length}`)} more` :
                  ""}`,
            },
          ] : [],
          data.ended_at ? [
            {
              name: "The word was:",
              value: inlineCode(data.data.word),
            },
          ] : [],
        ].flat()),
    ];

    try {
      await message.edit({
        components: data.ended_at ? [] : message.components,
        embeds,
      });
    } catch { null; }
  }
}
