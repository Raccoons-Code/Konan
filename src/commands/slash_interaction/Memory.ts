import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, time } from 'discord.js';
import { Memory } from '../../modules/Memory';
import { MemoryGameMode } from '../../modules/Memory/@types';
import { SlashCommand } from '../../structures';

const { solo, limited, coop, comp } = MemoryGameMode;

export default class extends SlashCommand {
  constructor() {
    super({
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('memory')
      .setDescription('Memory Game')
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
    if (interaction.isAutocomplete()) return this.executeAutocomplete(interaction);

    const { channel, options, user } = interaction;

    const emojis = Memory.getEmojis(options.getString('emojis')!);

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

    const timeToEnd = Memory.timeToEnd;

    const { components } = Memory.create({ emojis, mode, time: timeToEnd });

    const oldMessage = await interaction.reply({
      components,
      fetchReply: true,
    });

    if ([solo].includes(mode))
      setTimeout(async () => {
        const message = await channel?.messages.safeFetch(oldMessage.id);

        if (!message || Memory.checkEnd(message.components)) return;

        return interaction.editReply({
          components: Memory.endGame(message.components),
          content: 'Game over!',
        });
      }, timeToEnd.getTime() - Date.now());

    return interaction.editReply({
      content: [
        'Memory Game!',
        `Game mode: ${Memory.getGameMode(mode)}${mode === limited ?
          ` | time: ${time(timeToEnd, 'R')}` :
          ''}`,
        `Players: ${opponent ? `${user} ${['', '', '&', '`0` vs `0`'][mode]} ${opponent}` : user}`,
        [false, false, true, true][mode] ? `Player: ${[user, opponent][Math.floor(Math.random() * 2)]}` : '',
      ].join('\n'),
    });
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const focused = interaction.options.getFocused(true);
    const pattern = RegExp(focused.value, 'i');

    if (focused.name === 'emojis') {
      const emojis = Object.entries(Memory.Emojis).filter(a => pattern.test(a[0]));

      for (let i = 0; i < emojis.length; i++) {
        const emoji = emojis[i];

        res.push({
          name: emoji[0],
          value: emoji[0],
        });
      }
    }

    return interaction.respond(res);
  }
}