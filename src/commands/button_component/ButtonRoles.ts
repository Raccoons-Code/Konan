import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ComponentType } from 'discord.js';
import { ButtonRolesCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

export default class ButtonRoles extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'buttonroles',
      description: 'Button roles',
      clientPermissions: ['ManageRoles'],
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

    const [, label] = component.label?.match(this.regexp.labelWithCount) ?? [];

    const components = message.components.map(row => {
      if (row.components[0].type !== ComponentType.Button) return row;
      if (row.components.every(element => element.customId !== customId)) return row;

      return new ActionRowBuilder<ButtonBuilder>(row.toJSON())
        .setComponents(row.components.map(element => {
          const button = new ButtonBuilder(element.toJSON());

          if (element.customId !== customId) return button;

          return button
            .setCustomId(JSON.stringify(newCustomId))
            .setLabel([label, newCustomId.count].join(' ').trim());
        }));
    });

    return interaction.update({ components });
  }
}