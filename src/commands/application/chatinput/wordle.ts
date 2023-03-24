import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, inlineCode, messageLink, TextBasedChannel, userMention } from "discord.js";
import client from "../../../client";
import prisma from "../../../database/prisma";
import { dictionaries } from "../../../modules/Dictionaries";
import wordle from "../../../modules/Wordle";
import ChatInputCommand from "../../../structures/ChatInputCommand";


export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Game",
    });

    this.data.setName("wordle")
      .setDescription("The game of wordle.");
  }

  build() {
    this.data
      .addIntegerOption(option => option.setName("word_size")
        .setDescription("The size of the word to be drawn. default: 4")
        .setMaxValue(10)
        .setMinValue(4))
      .addStringOption(option => option.setName("add_players")
        .setDescription("Add players to the game. Format: `id` `@user`"));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const locale = interaction.locale;

    let playersId = <string[]>interaction.options.getString("add_players")
      ?.match(/\d{17,}/g) ?? [];

    if (playersId?.length) {
      if (!interaction.guild) {
        await interaction.reply({
          content: "You need to be in a guild to use this option.",
          ephemeral: true,
        });
        return 1;
      }

      playersId = Array.from(new Set(playersId));

      playersId = await interaction.guild.members.fetch({ user: playersId })
        .then(members => members.map(member => member.id));

      if (!playersId.length) {
        await interaction.reply({
          content: "No valid users were found.",
          ephemeral: true,
        });
        return 1;
      }
    }

    const players = Array.from(new Set([interaction.user.id].concat(playersId)))
      .map(id => userMention(id));

    const oldInstance = await prisma.wordleInstance.findFirst({
      where: {
        userId: interaction.user.id,
        endedAt: {
          isSet: false,
        },
      },
    });

    const promises: Promise<unknown>[] = [];

    if (oldInstance) {
      const channel = await client.channels.fetch(oldInstance.channelId) as TextBasedChannel | null;
      const message = await channel?.messages.fetch(oldInstance.messageId).catch(() => null);

      if (message) {
        if (playersId.length) {
          playersId = playersId.filter(id => !oldInstance.players.includes(id));

          if (!playersId.length) {
            await interaction.editReply("No new players were added.");
            return 1;
          }

          await prisma.wordleInstance.update({
            where: {
              messageId: oldInstance.messageId,
            },
            data: {
              players: {
                set: oldInstance.players.concat(playersId),
              },
            },
          });

          try {
            await message.edit({
              embeds: [
                new EmbedBuilder(message.embeds[0].toJSON())
                  .setFields(playersId.length ? [
                    {
                      name: `Players [${playersId.concat(interaction.user.id).length}]`,
                      value: `${players.splice(0, 10).join("\n")}`
                        + `${players.length ?
                          `\n...and ${inlineCode(`${players.length}`)} more` :
                          ""}`,
                    },
                  ] : []),
              ],
            });
          } catch { }

          await interaction.editReply({
            components: [
              new ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                  new ButtonBuilder()
                    .setEmoji("🔍")
                    .setLabel("Join to the game")
                    .setStyle(ButtonStyle.Link)
                    .setURL(messageLink(oldInstance.channelId, oldInstance.messageId)),
                ]),
            ],
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${playersId.length} added to your game.`),
            ],
          });
          return;
        }

        await interaction.editReply({
          components: [
            new ActionRowBuilder<ButtonBuilder>()
              .addComponents([
                new ButtonBuilder()
                  .setEmoji("🔍")
                  .setLabel("Join to the game")
                  .setStyle(ButtonStyle.Link)
                  .setURL(messageLink(oldInstance.channelId, oldInstance.messageId)),
                new ButtonBuilder()
                  .setCustomId(JSON.stringify({ c: "wordle", sc: "giveupOldInstance" }))
                  .setEmoji("🚮")
                  .setLabel("Delete your old game instance")
                  .setStyle(ButtonStyle.Danger),
              ]),
          ],
          content: "You already have an active Wordle game.",
        });
        return;
      }

      promises.push(prisma.wordleInstance.updateMany({
        where: {
          messageId: oldInstance.messageId,
          endedAt: {
            isSet: false,
          },
        },
        data: {
          endedAt: new Date(),
        },
      }));
    }

    const wordSize = interaction.options.getInteger("word_size") || 4;

    const word = await dictionaries.random(locale, wordSize);
    if (!word) {
      await interaction.editReply("There are no words in the dictionary for your locale.");
      return 1;
    }

    const gameBoard = wordle.create(wordSize);

    const message = await interaction.channel!.send({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: "wordle", sc: "try" }))
              .setEmoji("📝")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: "wordle", sc: "giveup" }))
              .setEmoji("🏳️")
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setDescription(wordle.transformToString(wordle.transformToEmojis(gameBoard)))
          .setTitle("Wordle")
          .setFields(players.length > 1 ? [
            {
              name: `Players [${players.length}]`,
              value: `${players.splice(0, 10).join("\n")}`
                + `${players.length ?
                  `\n...and ${inlineCode(`${players.length}`)} more` :
                  ""}`,
            },
          ] : []),
      ],
    });

    promises.push(prisma.wordleInstance.create({
      data: {
        channelId: `${interaction.channel?.id}`,
        guildId: interaction.guild?.id,
        messageId: message.id,
        userId: interaction.user.id,
        data: {
          word: word.toLowerCase(),
          board: gameBoard,
        },
        players: Array.from(new Set([interaction.user.id].concat(playersId))),
      },
    }));

    promises.push(interaction.deleteReply().catch(() => null));

    await Promise.all(promises);

    return;
  }
}
