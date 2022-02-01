const { ButtonInteraction } = require('../../classes');

module.exports = class extends ButtonInteraction {
  constructor(...args) {
    super(...args);
    this.data = {
      name: 'button_roles',
      description: 'Button roles',
    };
  }

  async execute(interaction = this.ButtonInteraction) {

    const { customId, member } = interaction;

    const { roleId } = JSON.parse(customId);

    if (!member.manageable)
      return interaction.deferUpdate();

    member.roles.resolve(roleId) ?
      member.roles.remove(roleId)
        .then(() => this.setComponents(interaction, false))
        .catch(() => null) :
      member.roles.add(roleId)
        .then(() => this.setComponents(interaction, true))
        .catch(() => null);
  }

  setComponents(interaction = this.ButtonInteraction, boolean) {
    const { customId, component, message } = interaction;

    const oldCustomId = JSON.parse(customId);

    const newCustomId = {
      ...oldCustomId,
      count: oldCustomId.count + (boolean ? 1 : -1),
    };

    component.setCustomId(JSON.stringify(newCustomId));

    const components = message.components.map(c => {
      if (c.components[0].type !== 'BUTTON') return c;

      c.components = c.components.map(b => b.customId === customId ? component : b);

      return c;
    });

    interaction.update({ components });
  }
};