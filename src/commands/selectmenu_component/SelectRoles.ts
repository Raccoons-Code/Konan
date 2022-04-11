import { MessageSelectOptionData, SelectMenuInteraction } from 'discord.js';
import { Client, SelectMenuComponentInteraction } from '../../structures';
import { RolesManager, SelectRolesCustomId, SelectRolesItemOptionValue } from '../../typings';

export default class SelectRoles extends SelectMenuComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'selectroles',
      description: 'Select Roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager = { add: [], remove: [] }) {
    const { member, values } = interaction;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const { roleId } = <SelectRolesItemOptionValue>JSON.parse(value);

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

      const add2 = roles.add.includes(roleId) ? 1 : 0;
      const rem2 = roles.remove.includes(roleId) ? -1 : 0;

      let sum = add2 + rem2;

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

    let sum = roles.add.length - roles.remove.length;

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