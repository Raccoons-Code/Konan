import { ActionRow, APIActionRowComponent, APIButtonComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role } from 'discord.js';
import assert from 'node:assert';
import Util from '../../util';

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
            },
            {
              label: '2',
              value: JSON.stringify({ roleId: '2' }),
            },
          ],
          custom_id: '1',
        },
      ],
    }),
    type: ComponentType.ActionRow,
  },
];

{
  const result = Util.setDefaultRole(rows, <Role>{ id: '3' });

  for (let i = 0; i < result.length; i++) {
    const component = result[i];

    for (let j = 0; j < component.components.length; j++) {
      const element = component.components[j];

      const elementJson = element.toJSON();

      if (elementJson.type !== ComponentType.SelectMenu) continue;

      assert.equal(elementJson.options?.[0].default, false);
      assert.equal(elementJson.options?.[1].default, false);
    }
  }
}

{
  const result = Util.setDefaultRole(rows, <Role>{ id: '1' });

  for (let i = 0; i < result.length; i++) {
    const component = result[i];

    for (let j = 0; j < component.components.length; j++) {
      const element = component.components[j];

      const elementJson = element.toJSON();

      if (elementJson.type !== ComponentType.SelectMenu) continue;

      assert.equal(elementJson.options?.[0].default, true);
      assert.equal(elementJson.options?.[1].default, false);
    }
  }
}