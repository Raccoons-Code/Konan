import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, inlineCode, messageLink, SlashCommandBuilder, userMention } from 'discord.js';
import { dictionaries } from '../../modules/Dictionaries';
import { Wordle } from '../../modules/Wordle';
import { SlashCommand } from '../../structures';

export default class extends SlashCommand {
  constructor() {
    super({
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('wordle')
      .setDescription('The game of wordle.')
      .addIntegerOption(option => option.setName('word_size')
        .setDescription('The size of the word to be drawn. default: 4')
        .setMaxValue(10)
        .setMinValue(4))
      .addStringOption(option => option.setName('add_players')
        .setDescription('Add players to the game. Format: `id` `@user`'));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { channel, guild, locale, options, user } = interaction;

    let playersId = options.getString('add_players')?.match(/\d{17,}/g) ?? [];

    if (playersId.length) {
      if (!guild)
        return interaction.reply({
          content: 'You need to be in a guild to use this option.',
          ephemeral: true,
        });

      playersId = await guild.members.fetch({ user: playersId }).then(ms => ms.map(m => m.id));

      if (!playersId.length)
        return interaction.reply({
          content: 'No valid users were found.',
          ephemeral: true,
        });
    }

    const players = [...new Set([user.id].concat(playersId))].map(id => userMention(id));

    const oldInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        userId: user.id,
        endedAt: {
          isSet: false,
        },
      },
    });

    if (oldInstance) {
      await interaction.deferReply({ ephemeral: true });

      if (playersId.length) {
        playersId = playersId.filter(id => !oldInstance.players.includes(id));

        if (!playersId.length)
          return interaction.editReply('No new players were added.');

        await this.prisma.wordleInstance.update({
          where: {
            messageId: oldInstance.messageId,
          },
          data: {
            players: {
              set: oldInstance.players.concat(playersId),
            },
          },
        });

        const message = await channel?.messages.safeFetch(oldInstance.messageId);
        if (message)
          try {
            await message.edit({
              embeds: [
                new EmbedBuilder(message.embeds[0].toJSON())
                  .setFields(playersId.length ? [
                    {
                      name: `Players [${playersId.concat(user.id).length}]`,
                      value: `${players.splice(0, 10).join('\n')}\n${players.length ?
                        `...and ${inlineCode(`${players.length}`)} more` :
                        ''}`,
                    },
                  ] : []),
              ],
            });
          } catch { null; }

        return interaction.editReply({
          components: [
            new ActionRowBuilder<ButtonBuilder>()
              .setComponents([
                new ButtonBuilder()
                  .setEmoji('🔍')
                  .setLabel('Join to the game')
                  .setStyle(ButtonStyle.Link)
                  .setURL(messageLink(oldInstance.channelId, oldInstance.messageId)),
              ]),
          ],
          embeds: [
            new EmbedBuilder()
              .setColor('Random')
              .setTitle(`${playersId.length} added to your game.`),
          ],
        });
      }

      return interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .setComponents([
              new ButtonBuilder()
                .setEmoji('🔍')
                .setLabel('Join to the game')
                .setStyle(ButtonStyle.Link)
                .setURL(messageLink(oldInstance.channelId, oldInstance.messageId)),
              new ButtonBuilder()
                .setCustomId(JSON.stringify({ c: 'wordle', sc: 'giveupOldInstance' }))
                .setEmoji('🚮')
                .setLabel('Delete your old game instance')
                .setStyle(ButtonStyle.Danger),
            ]),
        ],
        content: 'You already have an active Wordle game.',
      });
    }

    const message = await interaction.deferReply({ fetchReply: true });

    const wordSize = options.getInteger('word_size') || 4;

    const word = await dictionaries.random(locale, wordSize);
    if (!word)
      return interaction.editReply({
        content: 'There are no words in the dictionary for your locale.',
      });

    const gameBoard = Wordle.create(wordSize);

    await this.prisma.wordleInstance.create({
      data: {
        channelId: `${channel?.id}`,
        guildId: guild?.id,
        messageId: message.id,
        userId: user.id,
        data: {
          word: word.toLowerCase(),
          board: gameBoard,
        },
        players: [...new Set([user.id].concat(playersId))],
      },
    });

    return interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'wordle', sc: 'try' }))
              .setEmoji('📝')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: 'wordle', sc: 'giveup' }))
              .setEmoji('🏳️')
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(Wordle.transformToString(Wordle.transformToEmojis(gameBoard)))
          .setTitle('Wordle')
          .setFields(players.length > 1 ? [
            {
              name: `Players [${players.length}]`,
              value: `${players.splice(0, 10).join('\n')}\n${players.length ?
                `...and ${players.length} more` :
                ''}`,
            },
          ] : []),
      ],
    });
  }
}