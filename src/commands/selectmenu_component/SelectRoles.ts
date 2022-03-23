import { MessageSelectOptionData, SelectMenuInteraction } from 'discord.js';
import { Client, SelectMenuComponentInteraction } from '../../structures';
import { SelectRolesCustomId, SelectRolesItemOptionValue } from '../slash_interaction/SelectRoles';

export default class SelectRoles extends SelectMenuComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'selectroles',
      description: 'Select Roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>) {
    const { member, values } = interaction;

    const roles: { [k: string]: string[] } = { add: [], remove: [] };

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const { roleId } = this.util.parseJSON(value) as SelectRolesItemOptionValue;

      const role = member.roles.resolve(roleId);

      role ? roles.remove.push(role.id) : roles.add.push(roleId);
    }

    await member.roles.add(roles.add).catch(() => roles.add = []);
    await member.roles.remove(roles.remove).catch(() => roles.remove = []);

    await this.setComponents(interaction, roles);
  }

  async setComponents(interaction: SelectMenuInteraction<'cached'>, roles: { [k: string]: string[] }) {
    const { customId, component, message, values } = interaction;

    const { c, count, d } = this.util.parseJSON(customId) as SelectRolesCustomId;

    const { add, remove } = roles;

    let sum = add.length - remove.length;

    if (sum > 0)
      sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

    if (sum < 0)
      sum = (count + sum < 0 ? -count : sum);

    for (let i = 0; i < component.options.length; i++) {
      const option = component.options[i];

      if (!values.includes(option.value)) continue;

      const { count: count2, d: d2, roleId } = this.util.parseJSON(option.value) as SelectRolesItemOptionValue;

      const add2 = add.includes(roleId) ? 1 : 0;
      const rem2 = remove.includes(roleId) ? -1 : 0;

      let sum2 = add2 + rem2;

      if (sum2 > 0)
        sum2 = (count2 + sum2 > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count2 : sum2);

      if (sum2 < 0)
        sum2 = (count2 + sum2 < 0 ? -count2 : sum2);

      const newValue = {
        count: count2 + sum2,
        d: d2,
        roleId,
      };

      const [, label] = option.label.match(this.pattern.labelWithCount) || [];

      option.label = `${label} ${newValue.count}`;

      option.value = JSON.stringify(newValue);
    }

    component.setCustomId(JSON.stringify({
      c,
      count: count + sum,
      d,
    }))
      .setOptions(component.options as MessageSelectOptionData[]);

    const { components } = message;

    await interaction.update({ components });
  }
}