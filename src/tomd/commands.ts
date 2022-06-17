import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { ApplicationCommandAutocompleteOption, ApplicationCommandChannelOptionData, ApplicationCommandChoicesData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, ApplicationCommandSubCommandData } from 'discord.js';
import { writeFileSync } from 'node:fs';
import Commands from '../commands';
import { SlashCommand } from '../structures';

function convertOptionsToString(
  dataOptions: (
    APIApplicationCommandOption |
    ApplicationCommandSubCommandData |
    ApplicationCommandNonOptionsData |
    ApplicationCommandChoicesData |
    ApplicationCommandChannelOptionData |
    ApplicationCommandAutocompleteOption |
    ApplicationCommandNumericOptionData
  )[],
  text = '',
  index = '',
) {
  for (let i = 0; i < dataOptions.length; i++) {
    const { required } = <APIApplicationCommandOption>dataOptions[i];
    const { autocomplete, description, name, options } = <ApplicationCommandSubCommandData>dataOptions[i];

    text = [
      text,
      `${typeof required === 'boolean' ?
        required ?
          `${index}- <\`${name}\`>: ${description}` :
          `${index}- [\`${name}\`]: ${description}` :
        `\n${index}- {\`${name}\`}: ${description}`}`,
      autocomplete ? ' - `Autocomplete`' : '',
    ].join('');

    text = `${text}\n`;

    if (options)
      text = convertOptionsToString(options, `${text}`, index + '  ');
  }

  return text;
}

function convertOptionsToCommandString(
  dataOptions: (
    APIApplicationCommandOption |
    ApplicationCommandSubCommandData |
    ApplicationCommandNonOptionsData |
    ApplicationCommandChoicesData |
    ApplicationCommandChannelOptionData |
    ApplicationCommandAutocompleteOption |
    ApplicationCommandNumericOptionData
  )[],
  text = '',
  index = '',
) {
  for (let i = 0; i < dataOptions.length; i++) {
    const { required } = <APIApplicationCommandOption>dataOptions[i];
    const { name } = <ApplicationCommandSubCommandData>dataOptions[i];

    text = [
      text,
      index,
      `${typeof required === 'boolean' ?
        required ?
          ` <\`${name}\`>` :
          ` [\`${name}\`]` :
        ` ${i === 0 ? '{' : ''}${i ? ' | ' : ''}\`${name}\`${i === dataOptions.length - 1 ? '}' : ''}`}`,
    ].join('');
  }

  return text;
}

function convertCommandsToString(commands: SlashCommand[], text = ['']) {
  for (let i = 0; i < commands.length; i++) {
    const { data } = commands[i];

    const command_data = data.toJSON();

    text = [
      ...text,
      `\n#### ${data.name}${convertOptionsToCommandString(<any>command_data.options)}\n\n`,
      `> ${data.description}\n`,
      `${convertOptionsToString(<any>command_data.options)}`,
    ];
  }

  return text.join('');
}

(async () => {
  const ApplicationCommands = await Commands.loadCommands(Commands.applicationCommandTypes);

  const { commandsByCategory } = Commands;

  const txtCommands = Object.keys(commandsByCategory).reverse().map(category => {
    const commands = commandsByCategory[category];

    const text = convertCommandsToString(<SlashCommand[]>commands.toJSON());

    return `\n---\n\n### ${category} - ${commands.size}\n${text}`;
  });

  ApplicationCommands.slash_interaction = ApplicationCommands.slash_interaction
    .filter((command) => !!(<SlashCommand>command).props?.category);

  const text = [
    '<!-- markdownlint-disable MD032 MD033 -->\n\n',
    '# Commands\n\n',
    `Last modified: ${Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date())}\n\n`,
    `## Application Commands (/) - ${ApplicationCommands.slash_interaction.size}\n\n`,
    '**Optional**: [`foo`]  \n',
    '**Required**: <`foo`>  \n',
    '**Sub Command Group | Sub Command**: {`foo`}\n',
    ...txtCommands,
  ];

  writeFileSync(`${__dirname}/Commands.md`, text.join(''), 'utf8');
})();