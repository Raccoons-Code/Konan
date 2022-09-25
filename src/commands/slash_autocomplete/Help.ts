import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import commandHandler from '../../commands';
import { SlashAutocomplete } from '../../structures';

export default class Help extends SlashAutocomplete {
  constructor() {
    super({
      name: 'help',
      description: 'Show the help message.',
    });
  }

  async execute(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { options } = interaction;

    const focused = options.getFocused(true);

    if (focused.name === 'command') {
      const commandName = options.getString('command', true);

      const pattern = RegExp(commandName, 'i');

      const { slash_interaction } = commandHandler.commands;

      const slashCommands = slash_interaction.filter((c: any) =>
        !c.props?.ownerOnly && (
          pattern.test(c.data.name) ||
          pattern.test(c.data.description)
        )).toJSON();

      for (let i = 0; i < slashCommands.length; i++) {
        const command = slashCommands[i];

        const name = [
          this.t(command.data.name),
          ' | ',
          command.data.description,
        ].join('').slice(0, 100);

        res.push({
          name,
          value: `${command.data.name}`,
        });

        if (res.length === 25) break;
      }
    }

    return interaction.respond(res);
  }
}