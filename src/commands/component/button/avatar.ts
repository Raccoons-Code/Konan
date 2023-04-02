import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import client from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "avatar",
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"member">parsedId.next]?.(interaction, parsedId.id);

    return;
  }

  async member(interaction: ButtonInteraction<"cached">, id: string) {
    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: interaction.message.components[0]
            .toJSON().components.slice(0, 1),
        }),
      ],
    });

    const target = await interaction.guild.members.fetch(id);

    if (!target) return 1;

    const locale = interaction.locale;

    const name = target.displayAvatarURL().split("/").pop();

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setEmoji("🖼")
              .setLabel(t("link", { locale }))
              .setStyle(ButtonStyle.Link)
              .setURL(target.displayAvatarURL({ size: 4096 })),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "avatar",
                id: target.id,
                next: "user",
              }))
              .setLabel(t("viewUserAvatar", { locale }))
              .setStyle(ButtonStyle.Secondary),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(target.displayColor ?? target.user.accentColor ?? "Random")
          .setDescription(`${target}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(
          await fetch(target.displayAvatarURL({ size: 512 }))
            .then(res => res.arrayBuffer())
            .then(res => Buffer.from(res)), {
          name,
        }),
      ],
    });

    return;
  }

  async user(interaction: ButtonInteraction, id: string) {
    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: interaction.message.components[0]
            .toJSON().components.slice(0, 1),
        }),
      ],
    });

    const target = await client.users.fetch(id);

    const locale = interaction.locale;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel(t("link", { locale }))
            .setStyle(ButtonStyle.Link)
            .setURL(target.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    const member = await interaction.guild?.members.fetch(id);

    if (member?.avatar && member.avatar !== target.avatar) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: target.id,
            next: "member",
          }))
          .setLabel(t("viewMemberAvatar", { locale }))
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = target.displayAvatarURL().split("/").pop();

    await interaction.editReply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(target.accentColor ?? "Random")
          .setDescription(`${target}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(
          await fetch(target.displayAvatarURL({ size: 512 }))
            .then(res => res.arrayBuffer())
            .then(res => Buffer.from(res)), {
          name,
        }),
      ],
    });

    return;
  }
}
