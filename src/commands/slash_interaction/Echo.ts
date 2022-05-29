import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, MessageEmbed, TextChannel } from 'discord.js';
import { SlashCommand } from '../../structures';

const dynamic = true;

export default class Echo extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Fun',
      clientPermissions: ['MANAGE_WEBHOOKS'],
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

  async execute(interaction: CommandInteraction<'cached'>) {
    const { client, channel, member, options, user } = interaction;

    const content = options.getString('message', true);

    const avatarURL = member?.displayAvatarURL({ dynamic }) ?? user.displayAvatarURL({ dynamic });

    const username = member?.displayName ?? user.username;

    if (!channel?.permissionsFor(client.user!)?.has(this.props!.clientPermissions!)) {
      const [, title, description] = content.match(this.pattern.embed) ?? [];

      const embeds = [
        new MessageEmbed()
          .setColor(member?.displayColor || 'RANDOM')
          .setFooter({ text: username, iconURL: avatarURL })
          .setTimestamp(Date.now())
          .setTitle(title)
          .setDescription(description),
      ];

      return await interaction.reply({ embeds });
    }

    const webhook = await (<TextChannel>channel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await (<TextChannel>channel).createWebhook(client.user!.id);

    await webhook.send({ avatarURL, content, username });

    await interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
}