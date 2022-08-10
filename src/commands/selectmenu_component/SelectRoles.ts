import { ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, Colors, ComponentType, EmbedBuilder, Role, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import type { RolesManager, SelectRolesCustomId, SelectRolesOptionValue } from '../../@types';
import { SelectMenuComponentInteraction } from '../../structures';

export default class SelectRoles extends SelectMenuComponentInteraction {
  constructor() {
    super({
      name: 'selectroles',
      description: 'Select Roles',
      appPermissions: ['ManageRoles'],
    });
  }

  async execute(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager = { add: [], remove: [] }) {
    const { appPermissions, member, message, values } = interaction;

    const appPerms = appPermissions?.missing(this.data.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    const optionDefault = this.Util.getDefaultOptionFromSelectMenu(message.components);

    if (optionDefault) {
      const { id, roleId } = <SelectRolesOptionValue>JSON.parse(optionDefault.value);

      roles.add.push(id ?? roleId);

      roles.default = member.roles.resolve(id ?? roleId)?.id;
    }

    for (let i = 0; i < values.length; i++) {
      const { id, roleId } = <SelectRolesOptionValue>JSON.parse(values[i]);

      if (roles.add.includes(id ?? roleId)) continue;

      const role = member.roles.resolve(id ?? roleId);

      role ? roles.remove.push(role.id) : roles.add.push(id ?? roleId);
    }

    if (roles.remove.length)
      await member.roles.remove(roles.remove).catch(console.log);

    if (roles.add.length)
      await member.roles.add(roles.add).catch(console.log);

    await this.setComponents(interaction, roles);
    this.sendResponse(interaction, roles);
  }

  async setComponents(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager) {
    const { customId, message, values } = interaction;

    const components = message.components.map(row => {
      const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

      if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;
      if (rowJson.components.every(element => element.custom_id !== customId)) return row;

      return new ActionRowBuilder<SelectMenuBuilder>()
        .setComponents(rowJson.components.map(element => {
          const selectMenu = new SelectMenuBuilder(element);

          if (element.custom_id !== customId) return selectMenu;

          selectMenu.setOptions(element.options.map(option => {
            if (!values.includes(option.value)) return option;

            const { count, id, roleId } = <SelectRolesOptionValue>JSON.parse(option.value);

            const add = roles.add.includes(id ?? roleId) ? (id ?? roleId) === roles.default ? 0 : 1 : 0;
            const rem = roles.remove.includes(id ?? roleId) ? -1 : 0;

            let sum = add + rem;

            if (sum > 0)
              sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

            if (sum < 0)
              sum = (count + sum < 0 ? -count : sum);

            const newValue = {
              count: count + sum,
              id: id ?? roleId,
            };

            const [, label] = option.label.match(this.regexp.labelWithCount) ?? [];

            option.label = `${label} ${newValue.count}`;

            option.value = JSON.stringify(newValue);

            return option;
          }));

          const { c, count, d } = <SelectRolesCustomId>JSON.parse(customId);

          let sum = roles.add.length - roles.remove.length - (roles.default ? 1 : 0);

          if (sum > 0)
            sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

          if (sum < 0)
            sum = (count + sum < 0 ? -count : sum);

          return selectMenu.setCustomId(JSON.stringify({
            c,
            count: count + sum,
            d,
          }));
        }));
    });

    return interaction.update({ components });
  }

  async sendResponse(interaction: SelectMenuInteraction<'cached'>, roles: RolesManager) {
    const { guild } = interaction;

    const added = roles.add.reduce((acc, id) => {
      const role = guild.roles.resolve(id);
      if (!role) return acc;
      return acc.concat(role);
    }, <Role[]>[]);

    const removed = roles.remove.reduce((acc, id) => {
      const role = guild.roles.resolve(id);
      if (!role) return acc;
      return acc.concat(role);
    }, <Role[]>[]);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.Blue),
    ];

    if (added.length)
      embeds[0].addFields({
        name: `${this.Util.Emoji.Success} Added [${added.length}]`,
        value: added.join('\n'),
        inline: true,
      });

    if (removed.length)
      embeds[0].addFields({
        name: `${this.Util.Emoji.Danger} Removed [${removed.length}]`,
        value: removed.join('\n'),
        inline: true,
      });

    return interaction.followUp({ embeds, ephemeral: true });
  }
}