import { ActionRow, APIActionRowComponent, APIButtonComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent } from 'discord.js';
import assert from 'node:assert';
import Util from './../util';

const rows = <ActionRow<MessageActionRowComponent>[]>[
  {
    data: {},
    equals: (other: ActionRow<MessageActionRowComponent>) => other && true,
    toJSON: () => (<APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>>{
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          options: [
            {
              label: '1',
              value: JSON.stringify({ roleId: '1' }),
              emoji: undefined,
            },
            {
              label: '2',
              value: JSON.stringify({ roleId: '2' }),
              emoji: undefined,
            },
            {
              label: '3',
              value: JSON.stringify({ roleId: '3' }),
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

assert.deepStrictEqual((<APISelectMenuComponent>Util.removeSelectRoles(rows, '1')[0].toJSON().components[0]).options, (<APISelectMenuComponent>expected[0]).options.slice(1, 3));
assert.deepStrictEqual((<APISelectMenuComponent>Util.removeSelectRoles(rows, ['2', '3'])[0].toJSON().components[0]).options, (<APISelectMenuComponent>expected[0]).options.slice(0, 1));