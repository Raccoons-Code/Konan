import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, ComponentType, EmbedBuilder } from 'discord.js';
import type { ButtonRolesCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

export default class ButtonRoles extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'buttonroles',
      description: 'Button roles',
      appPermissions: ['ManageRoles'],
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { appPermissions, customId, member } = interaction;

    const appPerms = appPermissions?.missing(this.data.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    const { id, roleId } = <ButtonRolesCustomId>JSON.parse(customId);

    const memberHasRole = member.roles.cache.has(id ?? roleId);

    try {
      if (memberHasRole) {
        await member.roles.remove(id ?? roleId);
      } else {
        await member.roles.add(id ?? roleId);
      }

      await this.setComponents(interaction, memberHasRole);
      return this.sendResponse(interaction, id ?? roleId, memberHasRole);
    } catch {
      await interaction.deferUpdate();
    }
  }

  async setComponents(interaction: ButtonInteraction<'cached'>, memberHasRole: boolean) {
    const { customId, component, message } = interaction;

    const { c, count, id, roleId } = <ButtonRolesCustomId>JSON.parse(customId);

    const newCustomId = {
      c,
      count: count + (memberHasRole ? count ? -1 : 0 : count < Number.MAX_SAFE_INTEGER ? 1 : 0),
      id: id ?? roleId,
    };

    const [, label] = component.label?.match(this.regexp.labelWithCount) ?? [];

    const components = message.components.map(row => {
      if (row.components[0].type !== ComponentType.Button) return row;
      if (row.components.every(element => element.customId !== customId)) return row;

      return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(row.components.map(element => {
          const button = new ButtonBuilder(element.data);

          if (element.type !== ComponentType.Button) return button;
          if (element.style === ButtonStyle.Link) return button;
          if (element.customId !== customId) return button;

          return button
            .setCustomId(JSON.stringify(newCustomId))
            .setLabel(`${label} ${newCustomId.count}`);
        }));
    });

    return interaction.update({ components });
  }

  async sendResponse(interaction: ButtonInteraction<'cached'>, id: string, memberHasRole: boolean) {
    const role = interaction.guild.roles.resolve(id);
    if (!role) return;

    const embeds = [
      new EmbedBuilder()
        .setColor(memberHasRole ? Colors.Red : Colors.Green)
        .setFields(memberHasRole ?
          { name: 'Removed', value: `${role}` } :
          { name: 'Added', value: `${role}` }),
    ];

    return interaction.followUp({ embeds, ephemeral: true });
  }
}