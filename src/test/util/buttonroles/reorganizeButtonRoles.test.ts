import { ActionRow, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import assert from 'node:assert';
import Util from '../util';

const ComponentsForTest = <ActionRow<MessageActionRowComponent>[]>[
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button1',
          label: 'Button 1',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button2',
          label: 'Button 2',
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          custom_id: 'SelectMenu1',
          options: [
            {
              label: 'Option 1',
              value: 'Option1',
            },
          ],
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button3',
          label: 'Button 3',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button4',
          label: 'Button 4',
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          custom_id: 'SelectMenu2',
          options: [
            {
              label: 'Option 2',
              value: 'Option2',
            },
          ],
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button5',
          label: 'Button 5',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button6',
          label: 'Button 6',
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button7',
          label: 'Button 7',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button8',
          label: 'Button 8',
        },
      ],
    }),
  },
];

const ExpectedResult = <ActionRow<MessageActionRowComponent>[]>[
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button1',
          label: 'Button 1',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button2',
          label: 'Button 2',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button3',
          label: 'Button 3',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button4',
          label: 'Button 4',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button5',
          label: 'Button 5',
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          custom_id: 'SelectMenu1',
          options: [
            {
              label: 'Option 1',
              value: 'Option1',
            },
          ],
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button6',
          label: 'Button 6',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button7',
          label: 'Button 7',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: 'Button8',
          label: 'Button 8',
        },
      ],
    }),
  },
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.SelectMenu,
          custom_id: 'SelectMenu2',
          options: [
            {
              label: 'Option 2',
              value: 'Option2',
            },
          ],
        },
      ],
    }),
  },
];

const actual = Util.reorganizeButtonRoles(ComponentsForTest);

assert.deepEqual(actual.map(row => row.toJSON()), ExpectedResult.map(row => row.toJSON()));