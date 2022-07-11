import { ActionRowBuilder, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import assert from 'node:assert';
import Util from './../util';

{
  const roles = <Role[][]><unknown>[[
    { id: 1, name: '🍏' },
    { id: 2, name: '🍎' },
    { id: 3, name: '🍐' },
    { id: 4, name: '🍊' },
    { id: 5, name: '🍋' },
  ], [
    { id: 6, name: '🍌' },
  ]];

  const components = roles.map(array => new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents(new SelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setMaxValues(array.length)
      .setOptions(array.map(role => new SelectMenuOptionBuilder()
        .setDefault(role.id === roles[0][2].id)
        .setLabel(`${role.name} 0`)
        .setValue(JSON.stringify({
          count: 0,
          roleId: role.id,
        })).toJSON()))
      .setPlaceholder(roles[0][4].name)));

  assert.deepStrictEqual(Util.createSelectRoles({
    roles,
    defaultRole: roles[0][2],
    menuPlaceholder: roles[0][4].name,
  }), components);
}