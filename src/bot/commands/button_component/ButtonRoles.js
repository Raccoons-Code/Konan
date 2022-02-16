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

    const { roleId, onlyAdd } = JSON.parse(customId);

    member.roles.resolve(roleId) ? onlyAdd ? interaction.deferUpdate() :
      member.roles.remove(roleId)
        .then(() => this.setComponents(interaction, false))
        .catch(() => interaction.deferUpdate()) :
      member.roles.add(roleId)
        .then(() => this.setComponents(interaction, true))
        .catch(() => interaction.deferUpdate());
  }

  setComponents(interaction = this.ButtonInteraction, boolean) {
    const { customId, component, message } = interaction;

    const oldCustomId = JSON.parse(customId);

    const newCustomId = {
      ...oldCustomId,
      count: oldCustomId.count + (boolean ? 1 : -1),
    };

    component.setCustomId(JSON.stringify(newCustomId));

    const [, label] = component.label.match(/(.+?)(?:\s(\d+))+?/) || [];

    const name = `${label} ${newCustomId.count}`;

    component.setLabel(name);

    const { components } = message;

    interaction.update({ components });
  }
};