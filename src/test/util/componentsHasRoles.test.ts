import { ActionRow, APIActionRowComponent, APIButtonComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role } from 'discord.js';
import assert from 'node:assert';
import Util from './util';

{
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
                value: JSON.stringify({ id: '1' }),
              },
              {
                label: '2',
                value: JSON.stringify({ id: '2' }),
              },
            ],
            custom_id: '1',
          },
        ],
      }),
      type: ComponentType.ActionRow,
    },
  ];

  assert.equal(Util.componentsHasRoles(rows, <Role>{ id: '1' }), true);
  assert.equal(Util.componentsHasRoles(rows, <Role[]>[{ id: '1' }, { id: '2' }]), true);
  assert.equal(Util.componentsHasRoles(rows, <Role[]>[{ id: '1' }, { id: '3' }]), false);
  assert.equal(Util.componentsHasRoles(rows, <Role>{ id: '3' }), false);
}