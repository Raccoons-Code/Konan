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
          label: '1',
          type: ComponentType.Button,
          custom_id: JSON.stringify({ roleId: '1' }),
          emoji: undefined,
        },
        {
          label: '2',
          type: ComponentType.Button,
          custom_id: JSON.stringify({ roleId: '2' }),
          emoji: undefined,
        },
        {
          label: '3',
          type: ComponentType.Button,
          custom_id: JSON.stringify({ roleId: '3' }),
          emoji: undefined,
        },
      ],
    }),
    type: ComponentType.ActionRow,
  },
];

const expected = rows[0].toJSON().components;

assert.deepStrictEqual(Util.removeButtonRoles(rows, '2')[0].components[0].toJSON(), expected[0]);
assert.deepStrictEqual(Util.removeButtonRoles(rows, '1')[0].components[0].toJSON(), expected[1]);