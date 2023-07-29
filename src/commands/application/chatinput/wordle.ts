import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, inlineCode, MessageCreateOptions, messageLink, PermissionFlagsBits, PermissionsString, TextBasedChannel, userMention } from "discord.js";
import client from "../../../client";
import prisma from "../../../database/prisma";
import { dictionaries } from "../../../modules/Dictionaries";
import wordle from "../../../modules/Wordle";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { getLocalizations } from "../../../util/utils";


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
      .setNameLocalizations(getLocalizations("wordleName"))
      .setDescriptionLocalizations(getLocalizations("wordleDescription"))
      .addIntegerOption(option => option.setName("word_size")
        .setDescription("The size of the word to be drawn. default: 4")
        .setNameLocalizations(getLocalizations("wordleWordSizeName"))
        .setDescriptionLocalizations(getLocalizations("wordleWordSizeDescription"))
        .setMaxValue(10)
        .setMinValue(4))
      .addStringOption(option => option.setName("add_players")
        .setDescription("Add players to the game. Format: `id` `@user`")
        .setNameLocalizations(getLocalizations("wordleAddPlayersName"))
        .setDescriptionLocalizations(getLocalizations("wordleAddPlayersDescription")));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    let appChannelPerms: PermissionsString[] = ["ViewChannel"];

    if (interaction.channel && "permissionsFor" in interaction.channel) {
      appChannelPerms = interaction.channel.permissionsFor(client.user!)?.missing([
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ViewChannel,
      ]) ?? [];
    }

    await interaction.deferReply({ ephemeral: !appChannelPerms.length });

    const locale = interaction.locale;

    let playersId = <string[]>interaction.options.getString("add_players")
      ?.match(/\d{17,}/g) ?? [];

    if (playersId?.length) {
      if (!interaction.guild) {
        await interaction.editReply(t("onlyOnServerOption", interaction.locale));
        return 1;
      }

      playersId = Array.from(new Set(playersId));

      playersId = await interaction.guild.members.fetch({ user: playersId })
        .then(members => members.map(member => member.id));

      if (!playersId.length) {
        await interaction.editReply(t("noValidUsersFound", interaction.locale));
        return 1;
      }
    }

    const players = Array.from(new Set([interaction.user.id].concat(playersId)))
      .map(id => userMention(id));

    const oldInstance = await prisma.wordleInstance.findFirst({
      where: {
        user_id: interaction.user.id,
        ended_at: {
          isSet: false,
        },
      },
    });

    const promises: Promise<unknown>[] = [];

    if (oldInstance) {
      const channel = await client.channels.fetch(oldInstance.channel_id) as TextBasedChannel | null;
      const message = await channel?.messages.fetch(oldInstance.message_id).catch(() => null);

      if (message) {
        if (playersId.length) {
          playersId = playersId.filter(id =>
            !oldInstance.players.includes(id) ||
            !oldInstance.quitters.includes(id));

          if (!playersId.length) {
            await interaction.editReply(t("noNewPlayersAdded", interaction.locale));
            return 1;
          }

          promises.push(prisma.wordleInstance.update({
            where: {
              message_id: oldInstance.message_id,
            },
            data: {
              players: {
                set: oldInstance.players.concat(playersId),
              },
            },
          }));

          promises.push(message.edit({
            embeds: [
              new EmbedBuilder(message.embeds[0].toJSON())
                .setColor("Random")
                .setFields(playersId.length ? [
                  {
                    name: `Players [${playersId.concat(interaction.user.id).length}]`,
                    value: `${players.splice(0, 10).join("\n")}`
                      + (players.length ?
                        `\n${t("andNMore", {
                          locale,
                          n: inlineCode(`${players.length}`),
                        })}` :
                        ""),
                  },
                ] : []),
            ],
          }).catch(() => null));

          promises.push(interaction.editReply({
            components: [
              new ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                  new ButtonBuilder()
                    .setEmoji("🔍")
                    .setLabel(t("joinGame", interaction.locale))
                    .setStyle(ButtonStyle.Link)
                    .setURL(messageLink(oldInstance.channel_id, oldInstance.message_id)),
                ]),
            ],
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${playersId.length} added to your game.`),
            ],
          }));

          await Promise.all(promises);

          return;
        }

        await interaction.editReply({
          components: [
            new ActionRowBuilder<ButtonBuilder>()
              .addComponents([
                new ButtonBuilder()
                  .setEmoji("🔍")
                  .setLabel(t("joinGame", interaction.locale))
                  .setStyle(ButtonStyle.Link)
                  .setURL(messageLink(oldInstance.channel_id, oldInstance.message_id)),
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
          message_id: oldInstance.message_id,
          ended_at: {
            isSet: false,
          },
        },
        data: {
          ended_at: new Date(),
        },
      }));
    }

    const wordSize = interaction.options.getInteger("word_size") || 4;

    const word = await dictionaries.random(locale, wordSize);
    if (!word) {
      await interaction.editReply(t("emptyDictionaryOnLocale", interaction.locale));
      return 1;
    }

    const gameBoard = wordle.create(wordSize);

    const payload: MessageCreateOptions = {
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
    };

    const message = await (appChannelPerms.length ?
      interaction.editReply(payload) :
      interaction.channel!.send(payload));

    promises.push(prisma.wordleInstance.create({
      data: {
        channel_id: `${interaction.channel?.id}`,
        guild_id: interaction.guild?.id,
        message_id: message.id,
        user_id: interaction.user.id,
        data: {
          word: word.toLowerCase(),
          board: gameBoard,
        },
        players: Array.from(new Set([interaction.user.id].concat(playersId))),
      },
    }));

    if (!appChannelPerms.length)
      promises.push(interaction.deleteReply().catch(() => null));

    await Promise.all(promises);

    return;
  }
}
