import { ApplicationCommandNonOptionsData, ApplicationCommandOptionData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { writeFileSync } from 'node:fs';
import CommandHandler from '../commands';
import { SlashCommand } from '../structures';
import { t } from '../translator';

function convertOptionsToString(
  dataOptions: (
    | ApplicationCommandSubGroupData
    | ApplicationCommandSubCommandData
    | ApplicationCommandOptionData
    | ApplicationCommandNonOptionsData
  )[],
  text = '',
  index = '',
) {
  for (let i = 0; i < dataOptions.length; i++) {
    const { name, options, description, autocomplete } = <ApplicationCommandSubGroupData>dataOptions[i];
    const { required } = <ApplicationCommandNonOptionsData>dataOptions[i];

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
    | ApplicationCommandSubGroupData
    | ApplicationCommandSubCommandData
    | ApplicationCommandOptionData
    | ApplicationCommandNonOptionsData
  )[],
  text = '',
  index = '',
) {
  for (let i = 0; i < dataOptions.length; i++) {
    const { name, required } = <ApplicationCommandNonOptionsData>dataOptions[i];

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
    const { default_member_permissions } = <RESTPostAPIApplicationCommandsJSONBody>command_data;

    text = [
      ...text,
      `\n#### ${data.name}${convertOptionsToCommandString(<any>command_data.options)}\n`,
      `${default_member_permissions ?
        `\n- Required permissions: ${new PermissionsBitField(BigInt(default_member_permissions))
          .toArray().map(p => t(p, { locale: 'en' })).join(' & ')}\n` : ''}`,
      `\n> ${data.description}\n`,
      `${convertOptionsToString(<any>command_data.options)}`,
    ];
  }

  return text.join('');
}

(async () => {
  const ApplicationCommands = await CommandHandler.loadCommands(CommandHandler.applicationCommandTypes);

  const { commandsByCategory } = CommandHandler;

  const txtCommands = Object.keys(commandsByCategory).reverse().map(category => {
    const commands = commandsByCategory[category];

    const text = convertCommandsToString(<SlashCommand[]>commands.toJSON());

    return `\n---\n\n### ${category} - ${commands.size}\n${text}`;
  });

  ApplicationCommands.slash_interaction = ApplicationCommands.slash_interaction
    .filter((command) => !!(<any>command).props?.category);

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