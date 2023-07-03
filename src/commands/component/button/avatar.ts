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

  async banner(interaction: ButtonInteraction<"cached">, id: string) {
    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: interaction.message.components[0].toJSON()
            .components.slice(0, 1),
        }),
      ],
    });

    const member = await interaction.guild?.members.fetch(id).catch(() => null);
    const user = member?.user ?? await client.users.fetch(id);

    await user.fetch();

    const components = [new ActionRowBuilder<ButtonBuilder>()];

    if (user.banner) {
      components[0].addComponents(new ButtonBuilder()
        .setEmoji("🖼")
        .setLabel(t("link", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(user.bannerURL({ size: 4096 })!));
    }

    components[0].addComponents(new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: "avatar",
        id: user.id,
        next: "user",
      }))
      .setLabel(t("viewUserAvatar", interaction.locale))
      .setStyle(ButtonStyle.Secondary));

    if (member?.avatar && member.avatar !== user.avatar) {
      components[0].addComponents(new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: "avatar",
          id: user.id,
          next: "member",
        }))
        .setLabel(t("viewMemberAvatar", interaction.locale))
        .setStyle(ButtonStyle.Secondary));
    }

    if (!user.banner) {
      await interaction.editReply({
        components,
      });

      return 1;
    }

    const name = user.bannerURL()!.split("/").pop();

    await interaction.editReply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(member?.displayColor ?? user.accentColor ?? "Random")
          .setDescription(`${user}`)
          .setImage(`attachment://${name}`),
      ],
      files: [
        new AttachmentBuilder(user.bannerURL({ size: 512 })!, { name }),
      ],
    });

    return;
  }

  async member(interaction: ButtonInteraction<"cached">, id: string) {
    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: interaction.message.components[0].toJSON()
            .components.slice(0, 1),
        }),
      ],
    });

    const member = await interaction.guild?.members.fetch(id).catch(() => null);
    const user = member?.user ?? await client.users.fetch(id);

    await user.fetch();

    const components = [new ActionRowBuilder<ButtonBuilder>()];

    if (member) {
      components[0].addComponents(new ButtonBuilder()
        .setEmoji("🖼")
        .setLabel(t("link", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(member.displayAvatarURL({ size: 4096 })));
    }

    components[0].addComponents(new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: "avatar",
        id: user.id,
        next: "user",
      }))
      .setLabel(t("viewUserAvatar", interaction.locale))
      .setStyle(ButtonStyle.Secondary));

    if (user.banner) {
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: "avatar",
            id: user.id,
            next: "banner",
          }))
          .setLabel(t("viewUserBanner", interaction.locale))
          .setStyle(ButtonStyle.Secondary),
      );
    }

    if (!member) {
      await interaction.editReply({
        components,
      });

      return 1;
    }

    const name = member.displayAvatarURL().split("/").pop();

    await interaction.editReply({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(member.displayColor ?? user.accentColor ?? "Random")
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
    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: interaction.message.components[0].toJSON()
            .components.slice(0, 1),
        }),
      ],
    });

    const member = await interaction.guild?.members.fetch(id).catch(() => null);
    const user = member?.user ?? await client.users.fetch(id);

    await user.fetch();

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji("🖼")
            .setLabel(t("link", interaction.locale))
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    if (member?.avatar && member.avatar !== user.avatar) {
      components[0].addComponents(new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: "avatar",
          id: user.id,
          next: "member",
        }))
        .setLabel(t("viewMemberAvatar", interaction.locale))
        .setStyle(ButtonStyle.Secondary));
    }

    if (user.banner) {
      components[0].addComponents(new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: "avatar",
          id: user.id,
          next: "banner",
        }))
        .setLabel(t("viewUserBanner", interaction.locale))
        .setStyle(ButtonStyle.Secondary));
    }

    const name = user.displayAvatarURL().split("/").pop();

    await interaction.editReply({
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
