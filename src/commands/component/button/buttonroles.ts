import { ButtonInteraction, Colors, EmbedBuilder, roleMention } from "discord.js";
import { ButtonRolesCustomId } from "../../../@types";
import ButtonCommand from "../../../structures/ButtonCommand";
import { editButtonById } from "../../../util/commands/components/buttonroles";

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

    const memberHasRole = interaction.member.roles.cache.has(parsedId.id);

    if (memberHasRole) {
      await interaction.member.roles.remove(parsedId.id);
    } else {
      await interaction.member.roles.add(parsedId.id);
    }

    await Promise.all([
      interaction.editReply({
        components: editButtonById(interaction.message.components, interaction.customId, {
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
                { name: "Removed", value: roleMention(parsedId.id) } :
                { name: "Added", value: roleMention(parsedId.id) },
            ),
        ],
        ephemeral: true,
      }),
    ]);

    return;
  }
}
