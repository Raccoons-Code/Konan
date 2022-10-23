import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { ButtonComponentInteraction } from '../../structures';

export default class extends ButtonComponentInteraction {
  [x: string]: any

  constructor() {
    super({
      name: 'avatar',
      description: 'Avatar',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId } = interaction;

    const { id, next } = JSON.parse(customId);

    return this[next]?.(interaction, id);
  }

  async member(interaction: ButtonInteraction<'cached'>, id: string) {
    const { guild, message } = interaction;

    const member = guild.members.resolve(id);

    if (!member)
      return interaction.update({
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder(message.components[0].toJSON().components[0]),
            ]),
        ],
        embeds: message.embeds,
      });

    const avatar = member.displayAvatarURL().split('/').pop();

    return interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setEmoji('🖼')
              .setLabel('Link')
              .setStyle(ButtonStyle.Link)
              .setURL(member.displayAvatarURL({ size: 4096 })),
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: 'avatar',
                id: member.id,
                next: 'user',
              }))
              .setLabel('User avatar')
              .setStyle(ButtonStyle.Secondary),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(member.displayColor ?? 'Random')
          .setDescription(`${member}`)
          .setImage(`attachment://${avatar}`),
      ],
      files: [
        new AttachmentBuilder(member.displayAvatarURL({ size: 512 }), { name: avatar }),
      ],
    });
  }

  async user(interaction: ButtonInteraction, id: string) {
    const { client, guild } = interaction;

    const user = await client.users.fetch(id);

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setEmoji('🖼')
            .setLabel('Link')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 4096 })),
        ]),
    ];

    const member = guild?.members.resolve(id);

    if (member?.avatar && member.avatar !== user.avatar)
      components[0].addComponents(
        new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: 'avatar',
            id: user.id,
            next: 'member',
          }))
          .setLabel('Member avatar')
          .setStyle(ButtonStyle.Secondary),
      );

    const avatar = user.displayAvatarURL().split('/').pop();

    return interaction.update({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor(user.accentColor ?? 'Random')
          .setDescription(`${user}`)
          .setImage(`attachment://${avatar}`),
      ],
      files: [
        new AttachmentBuilder(user.displayAvatarURL({ size: 512 }), { name: avatar }),
      ],
    });
  }
}