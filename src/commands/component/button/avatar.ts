import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import client from "../../../client";
import ButtonCommand from "../../../structures/ButtonCommand";

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
    const member = await interaction.guild.members.fetch(id);

    if (!member) {
      await interaction.update({
        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              interaction.message.components[0].toJSON().components[0],
            ],
          }),
        ],
      });

      return 1;
    }

    const name = member.displayAvatarURL().split("/").pop();

    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setEmoji("🖼")
              .setLabel("Link")
              .setStyle(ButtonStyle.Link)
              .setURL(member.displayAvatarURL({ size: 4096 })),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: "avatar",
                id: member.id,
                next: "user",
              }))
              .setLabel("User avatar")
              .setStyle(ButtonStyle.Secondary),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(member.displayColor ?? member.user.accentColor ?? "Random")
          .setDescription(`${member}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(member.displayAvatarURL({ size: 512 }), { name }),
      ],
    });

    return;
  }

  async user(interaction: ButtonInteraction, id: string) {
    const user = await client.users.fetch(id);

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel("Link")
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    const member = await interaction.guild?.members.fetch(id);

    if (member?.avatar && member.avatar !== user.avatar) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: user.id,
            next: "member",
          }))
          .setLabel("Member avatar")
          .setStyle(ButtonStyle.Secondary),
      );
    }

    const name = user.displayAvatarURL().split("/").pop();

    await interaction.update({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(user.accentColor ?? "Random")
          .setDescription(`${user}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(user.displayAvatarURL({ size: 512 }), { name }),
      ],
    });

    return;
  }
}
