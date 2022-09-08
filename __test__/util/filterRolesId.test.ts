import { ActionRow, APIActionRowComponent, APIButtonComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent } from 'discord.js';
import assert from 'node:assert';
import Util from './util';

{
  const rows = <ActionRow<MessageActionRowComponent>[]>[
    {
      type: ComponentType.ActionRow,
      data: {},
      equals: (other: ActionRow<MessageActionRowComponent>) => other && true,
      toJSON: () => (<APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>>{
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            custom_id: JSON.stringify({ id: '1' }),
          },
          {
            type: ComponentType.Button,
            custom_id: JSON.stringify({ id: '2' }),
          },
        ],
      }),
    },
    {
      type: ComponentType.ActionRow,
      equals: (other: ActionRow<MessageActionRowComponent>) => other && true,
      toJSON: () => (<APIActionRowComponent<APIButtonComponent | APISelectMenuComponent>>{
        type: ComponentType.ActionRow,
        components: [
          {
            custom_id: '5',
            options: [
              {
                label: '3',
                value: JSON.stringify({ id: '3' }),
              },
              {
                label: '4',
                value: JSON.stringify({ id: '4' }),
              },
            ],
            type: ComponentType.SelectMenu,
          },
        ],
      }),
    },
  ];

  assert.deepEqual(Util.filterRolesId(rows, ['1']), []);
  assert.deepEqual(Util.filterRolesId(rows, ['2']), []);
  assert.deepEqual(Util.filterRolesId(rows, ['1', '2']), []);
  assert.deepEqual(Util.filterRolesId(rows, ['5']), ['5']);
}