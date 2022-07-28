import { ActionRow, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import { ButtonRolesCustomId, SelectRolesOptionValue } from '../../@types';
import { JSONparse } from './JSONparse';

export function filterRolesId(components: ActionRow<MessageActionRowComponent>[], rolesId: string | string[]) {
  if (!Array.isArray(rolesId)) rolesId = [rolesId];

  for (let i = 0; i < components.length; i++) {
    const componentJson = components[i].toJSON();

    for (let j = 0; j < componentJson.components.length; j++) {
      const element = componentJson.components[j];

      if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link) {
        const id = JSONparse<ButtonRolesCustomId>(`${element.custom_id}`);

        if (rolesId.includes(`${id?.id ?? id?.roleId}`))
          rolesId.splice(rolesId.indexOf(`${id?.id ?? id?.roleId}`), 1);

        continue;
      }

      if (element.type === ComponentType.SelectMenu) {
        for (let k = 0; k < element.options.length; k++) {
          const option = element.options[k];

          const id = JSONparse<SelectRolesOptionValue>(`${option.value}`);

          if (rolesId.includes(`${id?.id ?? id?.roleId}`))
            rolesId.splice(rolesId.indexOf(`${id?.id ?? id?.roleId}`), 1);

          continue;
        }
      }
    }
  }

  return rolesId;
}