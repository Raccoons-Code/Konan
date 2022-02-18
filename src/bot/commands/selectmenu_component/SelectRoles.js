const { SelectMenuInteraction } = require('../../classes');

module.exports = class extends SelectMenuInteraction {
  constructor(...args) {
    super(...args, {
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

    this.setComponents(interaction, roles);
  }

  setComponents(interaction = this.SelectMenuInteraction, roles) {
    const { customId, component, message, values } = interaction;

    /** @type {customId} */
    const { c, command, count, d, date } = this.util.parseJSON(customId);

    const { add, remove } = roles;

    const newCustomId = {
      c: c || command,
      count: count + count < 999999999999999 && count > -999999999999999 ? (add.length - remove.length) : 0,
      d: d || date,
    };

    const { options } = component;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!values.includes(option.value)) continue;

      /** @type {optionValue} */
      const { count: count2, d: d2, date: date2, roleId } = this.util.parseJSON(option.value);

      const add1 = add.includes(roleId) ? 1 : 0;
      const rem1 = remove.includes(roleId) ? -1 : 0;

      const newValue = {
        count: count2 + count < 999999999999999 && count > -999999999999999 ? (add1 + rem1) : 0,
        d: d2 || date2,
        roleId,
      };

      const [, label] = option.label.match(/(.+?)(?:\s(\d+))+?/) || [];

      option.label = `${label} ${newValue.count}`;

      option.value = JSON.stringify(newValue);
    }

    component.setCustomId(JSON.stringify(newCustomId));
    component.setOptions(options);

    const { components } = message;

    interaction.update({ components });
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