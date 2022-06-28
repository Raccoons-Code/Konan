import { ActionRowBuilder, APISelectMenuComponent, Client, ComponentType, SelectMenuBuilder, SelectMenuComponent, SelectMenuInteraction } from 'discord.js';
import { RolesManager, SelectRolesCustomId, SelectRolesItemOptionValue } from '../../@types';
import { SelectMenuComponentInteraction } from '../../structures';

export default class SelectRoles extends SelectMenuComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'selectroles',
      description: 'Select Roles',
      clientPermissions: ['ManageRoles'],
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager = { add: [], remove: [] }) {
    const { member, message, values } = interaction;

    const actionRow = message.components.find(c =>
      c.components.some(co => co.type === ComponentType.SelectMenu &&
        co.options.some(option => option.default)));

    if (actionRow) {
      const component = <SelectMenuComponent>actionRow.components.find(co =>
        co.type === ComponentType.SelectMenu && co.options.some(option => option.default));

      const item_default = component.options.find(option => option.default)!;

      const { roleId } = <SelectRolesItemOptionValue>JSON.parse(item_default.value);

      roles.add.push(roleId);

      roles.default = member.roles.resolve(roleId)?.id;
    }

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const { roleId } = <SelectRolesItemOptionValue>JSON.parse(value);

      if (roles.add.includes(roleId)) continue;

      const role = member.roles.resolve(roleId);

      role ? roles.remove.push(role.id) : roles.add.push(roleId);
    }

    const promises = [];

    if (roles.add.length)
      promises.push(member.roles.add(roles.add).catch(() => roles.add = []));

    if (roles.remove.length)
      promises.push(member.roles.remove(roles.remove).catch(() => roles.remove = []));

    await Promise.all(promises);

    return this.setComponents(interaction, roles);
  }

  async setComponents(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager) {
    const { customId, message, values } = interaction;

    const components = message.components.map(row => {
      if (row.components[0].type !== ComponentType.SelectMenu) return row;
      if (row.components.every(element => element.customId !== customId)) return row;

      return new ActionRowBuilder<SelectMenuBuilder>(row.toJSON())
        .setComponents(row.components.map(element => {
          const selectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

          if (element.customId !== customId ||
            element.type !== ComponentType.SelectMenu) return selectMenu;

          selectMenu.setOptions(element.options.map(option => {
            if (!values.includes(option.value)) return option;

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

            return option;
          }));

          const { c, count, d } = <SelectRolesCustomId>JSON.parse(customId);

          let sum = roles.add.length - roles.remove.length - (roles.default ? 1 : 0);

          if (sum > 0)
            sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

          if (sum < 0)
            sum = (count + sum < 0 ? -count : sum);

          return selectMenu.setCustomId(JSON.stringify({
            c,
            count: count + sum,
            d,
          }));
        }));
    });

    return interaction.update({ components });
  }
}