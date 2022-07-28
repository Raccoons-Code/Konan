import { ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
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
    { id: 7, name: '🍉' },
    { id: 8, name: '🍇' },
    { id: 9, name: '🍓' },
    { id: 10, name: '🍈' },
    { id: 11, name: '🍒' },
    { id: 12, name: '🍑' },
    { id: 13, name: '🍍' },
    { id: 14, name: '🥝' },
    { id: 15, name: '🍅' },
    { id: 16, name: '🍆' },
    { id: 17, name: '🥑' },
    { id: 18, name: '🥒' },
    { id: 19, name: '🥔' },
    { id: 20, name: '🥕' },
    { id: 21, name: '🌽' },
    { id: 22, name: '🌶' },
    { id: 23, name: '🥔' },
    { id: 24, name: '🍠' },
    { id: 25, name: '🍯' },
    { id: 26, name: '🍞' },
    { id: 27, name: '🥐' },
    { id: 28, name: '🥖' },
    { id: 29, name: '🥞' },
    { id: 30, name: '🍝' },
    { id: 31, name: '🍜' },
    { id: 32, name: '🍲' },
    { id: 33, name: '🍛' },
    { id: 34, name: '🍣' },
    { id: 35, name: '🍱' },
    { id: 36, name: '🍘' },
    { id: 37, name: '🍚' },
    { id: 38, name: '🍙' },
    { id: 39, name: '🍜' },
    { id: 40, name: '🍲' },
    { id: 41, name: '🍝' },
    { id: 42, name: '🍠' },
    { id: 43, name: '🍢' },
    { id: 44, name: '🍡' },
    { id: 45, name: '🍧' },
    { id: 46, name: '🍨' },
    { id: 47, name: '🍦' },
    { id: 48, name: '🍰' },
    { id: 49, name: '🎂' },
    { id: 50, name: '🍮' },
  ];

  const now = Date.now();

  const expected = [
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
          d: now,
        }))
        .setMaxValues(25)
        .setOptions(roles.slice(0, 25).map(role => new SelectMenuOptionBuilder()
          .setDefault(role.id === roles[2].id)
          .setLabel(`${role.name} 0`)
          .setValue(JSON.stringify({
            count: 0,
            id: role.id,
          }))))
        .setPlaceholder('')),
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
          d: now,
        }))
        .setMaxValues(25)
        .setOptions(roles.slice(25, 50).map(role => new SelectMenuOptionBuilder()
          .setDefault(role.id === roles[2].id)
          .setLabel(`${role.name} 0`)
          .setValue(JSON.stringify({
            count: 0,
            id: role.id,
          }))))
        .setPlaceholder('')),
  ];

  const actual = Util.createSelectMenuByRoles({
    roles,
    defaultRole: roles[2],
    menuPlaceholder: '',
  }).map(row => new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents((<APIActionRowComponent<APISelectMenuComponent>>row.toJSON()).components.map(element =>
      new SelectMenuBuilder(element)
        .setCustomId(JSON.stringify({
          ...JSON.parse(element.custom_id),
          d: now,
        })))));

  assert.deepEqual(actual, expected);
}