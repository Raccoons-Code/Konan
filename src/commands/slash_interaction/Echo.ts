import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Echo extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Fun',
      clientPermissions: ['ManageWebhooks'],
    });

    this.data = new SlashCommandBuilder().setName('echo')
      .setDescription('Echo your message.')
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

    if (!channel?.permissionsFor(client.user!)?.has(this.props!.clientPermissions!)) {
      const [, title, description] = content.match(this.pattern.embed) ?? [];

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(member?.displayColor || 'Random')
            .setDescription(description)
            .setFooter({ text: username, iconURL: avatarURL })
            .setTimestamp(Date.now())
            .setTitle(title),
        ],
      });
    }

    const webhook = await (<TextChannel>channel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await (<TextChannel>channel).createWebhook({
        name: `${client.user?.id}`,
      });

    await webhook.send({ avatarURL, content, username });

    return interaction.reply({ content: '☑️', ephemeral: true }).catch(() => null);
  }
}