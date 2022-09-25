import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Echo extends SlashCommand {
  constructor() {
    super({
      category: 'Fun',
      appPermissions: ['ManageWebhooks'],
    });

    this.data.setName('echo')
      .setDescription('Echo your message.');
  }

  build() {
    return this.data
      .setDMPermission(false)
      .setNameLocalizations(this.getLocalizations('echoName'))
      .setDescriptionLocalizations(this.getLocalizations('echoDescription'))
      .addStringOption(option => option.setName('message')
        .setDescription('Message to echo back.')
        .setNameLocalizations(this.getLocalizations('echoMessageOptionName'))
        .setDescriptionLocalizations(this.getLocalizations('echoMessageOptionDescription'))
        .setRequired(true));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { client, channel, member, options, user } = interaction;

    const content = options.getString('message', true);

    const avatarURL = member?.displayAvatarURL() ?? user.displayAvatarURL();

    const username = member?.displayName ?? user.username;

    if (
      !channel?.permissionsFor(client.user!)?.has(this.props!.appPermissions!) ||
      !('fetchWebhooks' in channel)
    ) {
      const [, title, description] = content.match(this.regexp.embed) ?? [];

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(member?.displayColor || 'Random')
            .setDescription(description || null)
            .setFooter({ text: username, iconURL: avatarURL })
            .setTimestamp(Date.now())
            .setTitle(title || null),
        ],
      });
    }

    const webhook = await channel.fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await channel.createWebhook({
        name: `${client.user?.id}`,
      });

    await webhook.send({ avatarURL, content, username });

    return interaction.reply({ content: '☑️', ephemeral: true }).catch(() => null);
  }
}