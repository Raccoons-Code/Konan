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
          custom_id: JSON.stringify({ roleId: '1' }),
          label: '1',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '2' }),
          label: '2',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '3' }),
          label: '3',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '4' }),
          label: '4',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '5' }),
          label: '5',
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
          custom_id: JSON.stringify({ roleId: '6' }),
          label: '6',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '7' }),
          label: '7',
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '8' }),
          label: '8',
        },
      ],
    }),
  },
];

const ExpectedComponents = <ActionRow<MessageActionRowComponent>[]>[
  {
    toJSON: () => ({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '1' }),
          label: '1',
          emoji: undefined,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '2' }),
          label: '2',
          emoji: undefined,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '4' }),
          label: '4',
          emoji: undefined,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '5' }),
          label: '5',
          emoji: undefined,
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
          custom_id: JSON.stringify({ roleId: '6' }),
          label: '6',
          emoji: undefined,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '7' }),
          label: '7',
          emoji: undefined,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          custom_id: JSON.stringify({ roleId: '8' }),
          label: '8',
          emoji: undefined,
        },
      ],
    }),
  },
];

const actual = Util.removeButtonsById(ComponentsForTest, JSON.stringify({ roleId: '3' }));

assert.deepEqual(actual.map(row => row.toJSON()), ExpectedComponents.map(row => row.toJSON()));