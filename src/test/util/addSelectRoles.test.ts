import { ActionRowBuilder, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
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

  const menuPlaceholder = 'Select roles';

  const components = [
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
        }))
        .setOptions(params.slice(0, 5).map(role => new SelectMenuOptionBuilder()
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            roleId: role.id,
          })).toJSON()))
        .setMaxValues(5)
        .setPlaceholder(menuPlaceholder)),
  ];

  const components2 = [
    new ActionRowBuilder<SelectMenuBuilder>(components[0].toJSON())
      .setComponents(new SelectMenuBuilder(components[0].components[0].toJSON())
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
        }))
        .addOptions(params.slice(5, 25).map(role => new SelectMenuOptionBuilder()
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            roleId: role.id,
          })).toJSON()))
        .setMaxValues(25)
        .setPlaceholder(menuPlaceholder)),
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
        }))
        .setOptions(params.slice(25, 30).map(role => new SelectMenuOptionBuilder()
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            roleId: role.id,
          })).toJSON()))
        .setMaxValues(params.slice(25, 30).length)
        .setPlaceholder(menuPlaceholder)),
  ];

  const selectRoles = Util.addSelectRoles(params.slice(5, 30), <any[]>components, menuPlaceholder);

  assert.deepEqual(selectRoles, components2);
}