import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Role } from 'discord.js';
import assert from 'node:assert';
import Util from '../util';

{
  const roles = <Role[]><unknown>[
    { id: 1, name: '🍏' },
    { id: 2, name: '🍎' },
    { id: 3, name: '🍐' },
    { id: 4, name: '🍊' },
    { id: 5, name: '🍋' },
    { id: 6, name: '🍌' },
  ];

  const expected = [
    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(roles.slice(0, 5).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          id: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle(ButtonStyle.Primary))),
    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(roles.slice(5, 6).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          id: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle(ButtonStyle.Primary))),
  ];

  assert.deepStrictEqual(Util.createButtonsByRoles({ roles }), expected);
}