const { SelectMenuInteraction } = require('../../classes');

module.exports = class extends SelectMenuInteraction {
  constructor(client) {
    super(client, {
      name: 'selectroles',
      description: 'Select Roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction = this.SelectMenuInteraction) {
    const { member, values } = interaction;

    const roles = { add: [], remove: [] };

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      /** @type {optionValue} */
      const { roleId } = this.util.parseJSON(value);

      const role = await member.roles.resolve(roleId);

      role ? roles.remove.push(role.id) : roles.add.push(roleId);
    }

    await member.roles.add(roles.add).catch(() => roles.add = []);
    await member.roles.remove(roles.remove).catch(() => roles.remove = []);

    await this.setComponents(interaction, roles);
  }

  async setComponents(interaction = this.SelectMenuInteraction, roles) {
    const { customId, component, message, values } = interaction;

    /** @type {customId} */
    const { c, command, count, d, date } = this.util.parseJSON(customId);

    const { add, remove } = roles;

    let sum = add.length - remove.length;

    if (sum > 0)
      sum = (count + sum > 999999999999999 ? 999999999999999 - count : sum);

    if (sum < 0)
      sum = (count + sum < 0 ? -count : sum);

    const newCustomId = {
      c: c || command,
      count: count + sum,
      d: d || date,
    };

    const { options } = component;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!values.includes(option.value)) continue;

      /** @type {optionValue} */
      const { count: count2, d: d2, date: date2, roleId } = this.util.parseJSON(option.value);

      const add2 = add.includes(roleId) ? 1 : 0;
      const rem2 = remove.includes(roleId) ? -1 : 0;

      let sum2 = add2 + rem2;

      if (sum2 > 0)
        sum2 = (count2 + sum2 > 999999999999999 ? 999999999999999 - count2 : sum2);

      if (sum2 < 0)
        sum2 = (count2 + sum2 < 0 ? -count2 : sum2);

      const newValue = {
        count: count2 + sum2,
        d: d2 || date2,
        roleId,
      };

      const [, label] = option.label.match(this.regexp.labelWithCount) || [];

      option.label = `${label} ${newValue.count}`;

      option.value = JSON.stringify(newValue);
    }

    component.setCustomId(JSON.stringify(newCustomId));
    component.setOptions(options);

    const { components } = message;

    await interaction.update({ components });
  }
};

/**
 * @typedef customId
 * @property {string} c
 * @property {number} count
 * @property {number} d
 */

/**
 * @typedef optionValue
 * @property {number} count
 * @property {number} d
 * @property {string} roleId
 */