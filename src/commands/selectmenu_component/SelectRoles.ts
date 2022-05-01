import { MessageSelectOptionData, SelectMenuInteraction } from 'discord.js';
import { RolesManager, SelectRolesCustomId, SelectRolesItemOptionValue } from '../../@types';
import { Client, SelectMenuComponentInteraction } from '../../structures';

export default class SelectRoles extends SelectMenuComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'selectroles',
      description: 'Select Roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager = { add: [], remove: [] }) {
    const { component, member, values } = interaction;

    const item_default = component.options.find(option => option.default);

    const { roleId: defaultRoleId } = <SelectRolesItemOptionValue>JSON.parse(item_default?.value ?? '{}');

    roles.add.push(defaultRoleId);

    roles.default = member.roles.resolve(defaultRoleId)?.id;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const { roleId } = <SelectRolesItemOptionValue>JSON.parse(value);

      if (roles.add.includes(roleId)) continue;

      const role = member.roles.resolve(roleId);

      role ? roles.remove.push(role.id) : roles.add.push(roleId);
    }

    if (roles.add.length)
      await member.roles.add(roles.add).catch(() => roles.add = []);

    if (roles.remove.length)
      await member.roles.remove(roles.remove).catch(() => roles.remove = []);

    await this.setComponents(interaction, roles);
  }

  async setComponents(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager) {
    const { customId, component, message, values } = interaction;

    for (let i = 0; i < component.options.length; i++) {
      const option = component.options[i];

      if (!values.includes(option.value)) continue;

      const { count, d, roleId } = <SelectRolesItemOptionValue>JSON.parse(option.value);

      const add = roles.add.includes(roleId) ? roleId === roles.default ? 0 : 1 : 0;
      const rem = roles.remove.includes(roleId) ? -1 : 0;

      let sum = add + rem;

      if (sum > 0)
        sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

      if (sum < 0)
        sum = (count + sum < 0 ? -count : sum);

      const newValue = {
        count: count + sum,
        d,
        roleId,
      };

      const [, label] = option.label.match(this.pattern.labelWithCount) ?? [];

      option.label = [label, newValue.count].join(' ').trim();

      option.value = JSON.stringify(newValue);
    }

    const { c, count, d } = <SelectRolesCustomId>JSON.parse(customId);

    let sum = roles.add.length - roles.remove.length - (roles.default ? 1 : 0);

    if (sum > 0)
      sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

    if (sum < 0)
      sum = (count + sum < 0 ? -count : sum);

    component.setCustomId(JSON.stringify({
      c,
      count: count + sum,
      d,
    }))
      .setOptions(<MessageSelectOptionData[]>component.options);

    await interaction.update({ components: message.components });
  }
}