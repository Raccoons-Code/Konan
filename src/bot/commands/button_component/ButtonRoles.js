const { ButtonInteraction } = require('../../classes');

module.exports = class extends ButtonInteraction {
  constructor(...args) {
    super(...args, {
      name: 'buttonroles',
      description: 'Button roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction = this.ButtonInteraction) {
    const { customId, member } = interaction;

    const { roleId } = this.util.parseJSON(customId);

    member.roles.resolve(roleId) ?
      member.roles.remove(roleId)
        .then(() => this.setComponents(interaction, false))
        .catch(() => interaction.deferUpdate()) :
      member.roles.add(roleId)
        .then(() => this.setComponents(interaction, true))
        .catch(() => interaction.deferUpdate());
  }

  setComponents(interaction = this.ButtonInteraction, boolean) {
    const { customId, component, message } = interaction;

    /** @type {customId} */
    const { c, command, count, date, roleId } = this.util.parseJSON(customId);

    const newCustomId = {
      c: c || command,
      d: date,
      count: count + (boolean ? 1 : -1),
      roleId,
    };

    component.setCustomId(JSON.stringify(newCustomId));

    const [, label] = component.label.match(/(.+?)(?:\s(\d+))+?/) || [];

    const name = `${label} ${newCustomId.count}`;

    component.setLabel(name);

    const { components } = message;

    interaction.update({ components });
  }
};

/**
 * @typedef customId
 * @property {string} c
 * @property {number} count
 * @property {number} d
 * @property {string} roleId
 */