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
    const oldCustomId = this.util.parseJSON(customId);

    const { add, remove } = roles;

    const newCustomId = {
      ...oldCustomId,
      count: oldCustomId.count + (add.length - remove.length),
    };

    const { options } = component;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!values.includes(option.value)) continue;

      const oldvalue = this.util.parseJSON(option.value);

      const add1 = add.includes(oldvalue.roleId) ? 1 : 0;
      const rem1 = remove.includes(oldvalue.roleId) ? -1 : 0;

      const newValue = {
        ...oldvalue,
        count: oldvalue.count + (add1 + rem1),
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
 * @property {string} command
 * @property {number} count
 * @property {number} date
 */

/**
 * @typedef optionValue
 * @property {number} count
 * @property {number} date
 * @property {string} roleId
 */