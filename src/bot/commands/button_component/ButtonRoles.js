const { ButtonInteraction } = require('../../classes');

module.exports = class extends ButtonInteraction {
  constructor(client) {
    super(client, {
      name: 'buttonroles',
      description: 'Button roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction = this.ButtonInteraction) {
    const { customId, member } = interaction;

    const { roleId } = this.util.parseJSON(customId);

    try {
      if (member.roles.resolve(roleId)) {
        await member.roles.remove(roleId);

        await this.setComponents(interaction, false);
      } else {
        await member.roles.add(roleId);

        await this.setComponents(interaction, true);
      }
    } catch {
      await interaction.deferUpdate();
    }
  }

  async setComponents(interaction = this.ButtonInteraction, boolean) {
    const { customId, component, message } = interaction;

    /** @type {customId} */
    const { c, command, count, d, date, roleId } = this.util.parseJSON(customId);

    const newCustomId = {
      c: c || command,
      count: count + (boolean ? count < 999999999999999 ? 1 : 0 : count > 0 ? -1 : 0),
      d: d || date,
      roleId,
    };

    component.setCustomId(JSON.stringify(newCustomId));

    const [, label] = component.label.match(/(.+?)(?:\s(\d+))+?/) || [];

    const name = `${label} ${newCustomId.count}`;

    component.setLabel(name);

    const { components } = message;

    await interaction.update({ components });
  }
};

/**
 * @typedef customId
 * @property {string} c
 * @property {number} count
 * @property {number} d
 * @property {string} roleId
 */