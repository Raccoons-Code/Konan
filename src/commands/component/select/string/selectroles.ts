import { ActionRowBuilder, APIActionRowComponent, APIStringSelectComponent, Colors, ComponentType, EmbedBuilder, roleMention, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { SelectRolesCustomId, SelectRolesManagement, SelectRolesOptionValue } from "../../../../@types";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { getDefaultOptionFromSelect } from "../../../../util/commands/components/selectmenu";
import regexp from "../../../../util/regexp";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "selectroles",
      appPermissions: ["ManageRoles"],
    });
  }

  async execute(
    interaction: StringSelectMenuInteraction<"cached">,
    roles: SelectRolesManagement = { add: [], remove: [], unmanageable: [] },
  ) {
    await interaction.deferUpdate();

    const optionDefault = getDefaultOptionFromSelect(interaction.message.components);

    if (optionDefault) {
      const parsedValue = <SelectRolesOptionValue>JSON.parse(optionDefault.value);

      const id = parsedValue.id ?? parsedValue.roleId;

      const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(id);

      if (typeof comparedRolePosition === "number" && comparedRolePosition > 0) {
        roles.add.push(id);
      }

      roles.default = interaction.member.roles.resolve(id)?.id;
    }

    for (const value of interaction.values) {
      const parsedValue = <SelectRolesOptionValue>JSON.parse(value);

      const id = parsedValue.id ?? parsedValue.roleId;

      if (roles.add.includes(id) || roles.remove.includes(id)) continue;

      const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(id);

      if (typeof comparedRolePosition === "number" && comparedRolePosition < 1) {
        roles.unmanageable.push(id);
        continue;
      }

      const role = interaction.member.roles.resolve(id);

      role ? roles.remove.push(id) : roles.add.push(id);
    }

    if (roles.remove.length) {
      await interaction.member.roles.remove(roles.remove);

      if (roles.add.length) {
        await interaction.member.fetch();
      }
    }

    if (roles.add.length) {
      await interaction.member.roles.add(roles.add);
    }

    await Promise.all([
      this.setComponents(interaction, roles),
      this.sendResponse(interaction, roles),
    ]);
    return;
  }

  async setComponents(
    interaction: StringSelectMenuInteraction<"cached">,
    roles: SelectRolesManagement,
  ) {
    const components = interaction.message.components.map(row => {
      const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

      if (rowJson.components[0].type !== ComponentType.StringSelect) return row;
      if (rowJson.components[0].custom_id !== interaction.customId) return row;

      return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(rowJson.components.map(select => {
          const selectMenu = new StringSelectMenuBuilder(select);

          if (select.custom_id !== interaction.customId)
            return selectMenu;

          selectMenu.setOptions(select.options.map(option => {
            if (!interaction.values.includes(option.value)) return option;

            const oldValue = <SelectRolesOptionValue>JSON.parse(option.value);

            const id = oldValue.id ?? oldValue.roleId;
            const count = oldValue.count;

            const add = roles.add.includes(id) ? id === roles.default ? 0 : 1 : 0;
            const rem = roles.remove.includes(id) ? -1 : 0;

            let sum = add + rem;

            if (sum > 0)
              sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

            if (sum < 0)
              sum = (count + sum < 0 ? -count : sum);

            const newValue = {
              count: count + sum,
              id,
            };

            const [, label] = option.label.match(regexp.labelWithCount) ?? [];

            option.label = `${label} ${newValue.count}`;

            option.value = JSON.stringify(newValue);

            return option;
          }));

          const oldValue = <SelectRolesCustomId>JSON.parse(interaction.customId);

          const count = oldValue.count;
          const c = oldValue.c;
          const d = oldValue.d;

          let sum = roles.add.length - roles.remove.length - (roles.default ? 1 : 0);

          if (sum > 0)
            sum = (count + sum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER - count : sum);

          if (sum < 0)
            sum = (count + sum < 0 ? -count : sum);

          return selectMenu
            .setCustomId(JSON.stringify({
              c,
              count: count + sum,
              d,
            }));
        }));
    });

    await interaction.editReply({ components });
    return;
  }

  async sendResponse(
    interaction: StringSelectMenuInteraction<"cached">,
    roles: SelectRolesManagement,
  ) {
    await interaction.member.fetch();

    const addFails: string[] = [];

    const added = roles.add.reduce<string[]>((acc, id) => {
      const role = interaction.member.roles.resolve(id);

      if (!role) {
        addFails.push(roleMention(id));
        return acc;
      }

      return acc.concat(roleMention(id));
    }, []);

    const removeFails: string[] = [];

    const removed = roles.remove.reduce<string[]>((acc, id) => {
      const role = interaction.member.roles.resolve(id);

      if (role) {
        removeFails.push(roleMention(id));
        return acc;
      }

      return acc.concat(roleMention(id));
    }, []);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.Blue),
    ];

    if (added.length) {
      embeds[0].addFields({
        name: `✅ ${t("added", interaction.locale)} [${added.length}]`,
        value: added.join("\n"),
        inline: true,
      });
    }

    if (removed.length) {
      embeds[0].addFields({
        name: `❌ ${t("removed", interaction.locale)} [${removed.length}]`,
        value: removed.join("\n"),
        inline: true,
      });
    }

    if (addFails.length || removeFails.length) {
      if (embeds[0].data.fields?.length) {
        embeds[0].addFields({
          name: "\u200B", value: "\u200B",
          inline: embeds[0].data.fields?.length === 2,
        });
      }

      if (addFails.length) {
        embeds[0].addFields({
          name: `⚠️ ${t("failedToAdd", interaction.locale)} [${addFails.length}]`,
          value: addFails.join("\n"),
          inline: true,
        });
      }

      if (removeFails.length) {
        embeds[0].addFields({
          name: `⚠️ ${t("failedToRemove", interaction.locale)} [${removeFails.length}]`,
          value: removeFails.join("\n"),
          inline: true,
        });
      }
    }

    if (roles.unmanageable.length) {
      embeds[0].addFields({
        name: `⚠️ ${t("unmanageable", interaction.locale)} [${roles.unmanageable.length}]`,
        value: roles.unmanageable.join("\n"),
        inline: embeds[0].data.fields?.length !== 2 &&
          embeds[0].data.fields?.length !== 4,
      });
    }

    await interaction.followUp({ embeds, ephemeral: true });
    return;
  }
}
