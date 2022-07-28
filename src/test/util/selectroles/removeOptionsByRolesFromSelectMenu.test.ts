import { ActionRow, APISelectMenuComponent, ComponentType, MessageActionRowComponent } from 'discord.js';
import assert from 'node:assert';
import Util from '../util';

const rows = <ActionRow<MessageActionRowComponent>[]>[
  {
    data: {},
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          options: [
            {
              label: '1',
              value: JSON.stringify({ id: '1' }),
              emoji: undefined,
            },
            {
              label: '2',
              value: JSON.stringify({ id: '2' }),
              emoji: undefined,
            },
            {
              label: '3',
              value: JSON.stringify({ id: '3' }),
              emoji: undefined,
            },
          ],
          custom_id: '1',
        },
      ],
    }),
    type: ComponentType.ActionRow,
  },
];

const expected = rows[0].toJSON().components;

assert.deepStrictEqual(
  (<APISelectMenuComponent>Util.removeOptionsByRolesFromSelectMenu(rows, '1')[0].toJSON().components[0]).options,
  (<APISelectMenuComponent>expected[0]).options.slice(1, 3),
);

assert.deepStrictEqual(
  (<APISelectMenuComponent>Util.removeOptionsByRolesFromSelectMenu(rows, ['2', '3'])[0].toJSON().components[0]).options,
  (<APISelectMenuComponent>expected[0]).options.slice(0, 1),
);