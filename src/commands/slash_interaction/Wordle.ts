import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, messageLink, SlashCommandBuilder } from 'discord.js';
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

    const oldInstance = await this.prisma.wordleInstance.findFirst({
      where: {
        players: {
          has: user.id,
        },
        endedAt: {
          isSet: false,
        },
      },
    });

    if (oldInstance)
      return interaction.reply({
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .setComponents([
              new ButtonBuilder()
                .setEmoji('🔍')
                .setLabel('Join')
                .setStyle(ButtonStyle.Link)
                .setURL(messageLink(oldInstance.channelId!, oldInstance.messageId)),
              new ButtonBuilder()
                .setCustomId(JSON.stringify({ c: 'wordle', sc: 'debug' }))
                .setEmoji('🐛')
                .setLabel('Delete old game instances')
                .setStyle(ButtonStyle.Danger),
            ]),
        ],
        content: 'You already have an active Wordle game.',
        ephemeral: true,
      });

    const playersId = options.getString('add_players')?.match(/\d{17,}/g) ?? [];

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
        channelId: channel?.id,
        guildId: guild?.id,
        messageId: message.id,
        data: {
          word: word.toLowerCase(),
          board: gameBoard,
        },
        players: playersId.concat([user.id]),
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
              .setStyle(ButtonStyle.Primary),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${Wordle.transformToString(Wordle.transformToEmojis(gameBoard))}`)
          .setTitle('Wordle'),
      ],
    });
  }
}