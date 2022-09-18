import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { MessageContextMenu } from '../../structures';

export default class extends MessageContextMenu {
  constructor() {
    super();

    this.data = new ContextMenuCommandBuilder().setName('Clear up to here')
      .setNameLocalizations(this.getLocalizations('clearUpToHereName'))
      .setType(ApplicationCommandType.Message)
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }

  async execute(interaction: MessageContextMenuCommandInteraction<'cached'>) {
    const { channel, client, locale, member, targetMessage } = interaction;

    if (!channel?.isTextBased()) return;

    const userPerms = channel.permissionsFor(member).missing('ManageMessages');

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserChannelPermission');

    const appPerms = channel.permissionsFor(client.user!)?.missing('ManageMessages');

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingChannelPermission');

    await interaction.deferReply({ ephemeral: true });

    let messages;
    try {
      messages = await channel.messages.fetch({ after: targetMessage.id, limit: 100 });
    } catch { null; }

    if (!messages)
      return interaction.editReply({
        embeds: [
          this.Util.EmbedHelper({
            title: this.t('noMessagesFound', { locale }),
          }, 'Error'),
        ],
      });

    const size = messages.size + 1;

    return interaction.editReply({
      embeds: [
        this.Util.EmbedHelper({}, 'Error')
          .setTitle(this.t('messageDeleteConfirm', {
            locale,
            count: size,
          })),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: 'clear',
                msgId: targetMessage.id,
              }))
              .setEmoji('🚮')
              .setStyle(ButtonStyle.Danger),
          ]),
      ],
    });
  }
}