import { ButtonInteraction, Client } from 'discord.js';
import { ButtonRolesCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

export default class ButtonRoles extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'buttonroles',
      description: 'Button roles',
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId, member } = interaction;

    const { roleId } = <ButtonRolesCustomId>JSON.parse(customId);

    try {
      if (member.roles.resolve(roleId)) {
        await member.roles.remove(roleId);

        return this.setComponents(interaction, false);
      } else {
        await member.roles.add(roleId);

        return this.setComponents(interaction, true);
      }
    } catch {
      await interaction.deferUpdate();
    }
  }

  async setComponents(interaction: ButtonInteraction<'cached'>, boolean: boolean) {
    const { customId, component, message } = interaction;

    const { c, count, d, roleId } = <ButtonRolesCustomId>JSON.parse(customId);

    const newCustomId = {
      c,
      count: count + (boolean ? count < Number.MAX_SAFE_INTEGER ? 1 : 0 : count > 0 ? -1 : 0),
      d,
      roleId,
    };

    component.setCustomId(JSON.stringify(newCustomId));

    const [, label] = component.label?.match(this.pattern.labelWithCount) ?? [];

    component.setLabel([label, newCustomId.count].join(' ').trim());

    return interaction.update({ components: message.components });
  }
}