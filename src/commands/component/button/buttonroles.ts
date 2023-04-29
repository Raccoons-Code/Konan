import { ButtonInteraction, Colors, EmbedBuilder, roleMention } from "discord.js";
import { ButtonRolesCustomId } from "../../../@types";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import { editRoleButtonById } from "../../../util/commands/components/buttonroles";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "buttonroles",
      appPermissions: ["ManageRoles"],
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = <ButtonRolesCustomId>JSON.parse(interaction.customId);

    const role = await interaction.guild.roles.fetch(parsedId.id);

    if (!role) {
      await interaction.followUp(t("role404", interaction.locale));
      return;
    }

    const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(role);

    if (typeof comparedRolePosition === "number" && comparedRolePosition < 1) {
      await interaction.followUp(t("roleManagementHierarchyError", interaction.locale));
      return;
    }

    const memberHasRole = interaction.member.roles.cache.has(parsedId.id);

    if (memberHasRole) {
      await interaction.member.roles.remove(parsedId.id);
    } else {
      await interaction.member.roles.add(parsedId.id);
    }

    await Promise.all([
      interaction.editReply({
        components: editRoleButtonById(interaction.message.components, interaction.customId, {
          count: parsedId.count + (
            memberHasRole ?
              parsedId.count ? -1 : 0 :
              parsedId.count < Number.MAX_SAFE_INTEGER ? 1 : 0
          ),
        }),
      }),
      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(memberHasRole ? Colors.Red : Colors.Green)
            .setFields(
              memberHasRole ?
                {
                  name: t("removed", interaction.locale),
                  value: roleMention(parsedId.id),
                } :
                {
                  name: t("added", interaction.locale),
                  value: roleMention(parsedId.id),
                },
            ),
        ],
        ephemeral: true,
      }),
    ]);

    return;
  }
}
