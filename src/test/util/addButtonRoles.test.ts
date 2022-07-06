import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Role } from 'discord.js';
import assert from 'node:assert';
import Util from '../../util';

{
  const params = <Role[]><unknown>[
    { id: 1, name: '🍏' },
    { id: 2, name: '🍎' },
    { id: 3, name: '🍐' },
    { id: 4, name: '🍊' },
    { id: 5, name: '🍋' },
    { id: 6, name: '🍌' },
  ];

  const components = [
    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(params.slice(0, 3).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name} 0`)
        .setStyle(ButtonStyle.Primary))),
  ];

  const expected = [
    new ActionRowBuilder<ButtonBuilder>(components[0].toJSON())
      .addComponents(params.slice(3, 5).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name} 0`)
        .setStyle(ButtonStyle.Primary))),
    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(params.slice(5).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name} 0`)
        .setStyle(ButtonStyle.Primary))),
  ];

  const buttonRoles = Util.addButtonRoles(params.slice(3), <any[]>components);

  assert.deepEqual(buttonRoles, expected);
}