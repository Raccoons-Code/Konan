import { ChatInputCommandInteraction, time } from 'discord.js';
import { Memory } from '../../modules/Memory';
import { MemoryGameMode } from '../../modules/Memory/@types';
import { SlashCommand } from '../../structures';

const { limited, coop, comp } = MemoryGameMode;

export default class extends SlashCommand {
  constructor() {
    super({
      category: 'Game',
    });

    this.data.setName('memory')
      .setDescription('Memory Game');
  }

  build() {
    return this.data
      .addIntegerOption(option => option.setName('mode')
        .setDescription('Choose the game mode.')
        .setChoices(
          ...Memory.gameMode.map((mode, i) => ({ name: mode, value: i })),
        ))
      .addUserOption(option => option.setName('opponent')
        .setDescription('Choose the opponent.'))
      .addStringOption(option => option.setName('emojis')
        .setDescription('Choose the game emojis.')
        .setAutocomplete(true));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { channel, options, user } = interaction;

    const emojis = <string[]>Memory.getEmojis(options.getString('emojis')!);

    if (emojis && (emojis.length < 5 || emojis.length > 12))
      return interaction.reply({
        content: 'The emojis must be between 5 and 12 emojis.',
        ephemeral: true,
      });

    const mode = options.getInteger('mode') ?? 0;

    const opponent = [coop, comp].includes(mode) && options.getUser('opponent');

    if ([coop, comp].includes(mode) && !opponent)
      return interaction.reply({
        content: 'You must choose an opponent.',
        ephemeral: true,
      });

    const timeToEnd = [coop].includes(mode) ? Memory.timeToEnd : null;

    const { components } = Memory.create({ emojis, mode, time: timeToEnd });

    const oldMessage = await interaction.reply({
      components,
      fetchReply: true,
    });

    if ([limited].includes(mode))
      setTimeout(async () => {
        const message = await channel?.messages.safeFetch(oldMessage.id);

        if (!message || Memory.checkEnd(message.components)) return;

        return interaction.editReply({
          components: Memory.endGame(message.components),
          content: 'Game over!',
        });
      }, timeToEnd?.getTime() ?? 0 - Date.now());

    return interaction.editReply({
      content: [
        'Memory Game!',
        `Game mode: ${Memory.getGameMode(mode)}${mode === limited ?
          ` | time: ${time(timeToEnd!, 'R')}` :
          ''}`,
        `Players: ${opponent ? `${user} ${['', '', '&', '`0` vs `0`'][mode]} ${opponent}` : user}`,
        [false, false, true, true][mode] ? `Player: ${[user, opponent][Math.floor(Math.random() * 2)]}` : '',
      ].join('\n'),
    });
  }
}