import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Role } from 'discord.js';
import assert from 'node:assert';
import Util from '../../util';

{
  const params = <Role[][]><unknown>[[
    { id: 1, name: '🍏' },
    { id: 2, name: '🍎' },
    { id: 3, name: '🍐' },
    { id: 4, name: '🍊' },
    { id: 5, name: '🍋' },
  ], [
    { id: 6, name: '🍌' },
  ]];

  const components = params.map(array => new ActionRowBuilder<ButtonBuilder>()
    .setComponents(array.map(role => new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: 'buttonroles',
        count: 0,
        roleId: role.id,
      }))
      .setLabel(`${role.name} 0`)
      .setStyle(ButtonStyle.Primary))));

  assert.deepStrictEqual(Util.createButtonRoles(params), components);
}