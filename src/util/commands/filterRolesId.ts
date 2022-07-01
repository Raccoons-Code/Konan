import { ActionRow, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';

export function filterRolesId(components: ActionRow<MessageActionRowComponent>[], rolesId: string | string[]) {
  if (!Array.isArray(rolesId)) rolesId = [rolesId];

  for (let i = 0; i < components.length; i++) {
    const componentJson = components[i].toJSON();

    for (let j = 0; j < componentJson.components.length; j++) {
      const element = componentJson.components[j];

      if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link) {
        const roleId = JSON.parse(`${element.custom_id}`).roleId;

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