import { ActionRow, ComponentType, MessageActionRowComponent } from 'discord.js';

export function filterRolesId(components: ActionRow<MessageActionRowComponent>[], rolesId: string[]) {
  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    for (let j = 0; j < component.components.length; j++) {
      const element = component.components[j];

      if (element.type === ComponentType.Button) {
        const roleId = JSON.parse(`${element.customId}`).roleId;

        if (rolesId.includes(roleId))
          rolesId.splice(rolesId.indexOf(roleId), 1);

        continue;
      }

      if (element.type === ComponentType.SelectMenu) {
        for (let k = 0; k < element.options.length; k++) {
          const option = element.options[k];

          const roleId = JSON.parse(`${option.value}`).roleId;

          if (rolesId.includes(roleId))
            rolesId.splice(rolesId.indexOf(roleId), 1);

          continue;
        }
      }
    }
  }

  return rolesId;
}