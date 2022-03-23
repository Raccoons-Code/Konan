import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, PermissionString, TextChannel, User } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

const dynamic = true;

export default class Echo extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['MANAGE_WEBHOOKS'],
    });

    this.data = new SlashCommandBuilder().setName('echo')
      .setDescription('Replies with your message!')
      .addStringOption(option => option.setName('message')
        .setDescription('Message to echo back.')
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction<'cached'>) {
    const { client, channel, member, options, user } = interaction;

    const content = options.getString('message', true);

    const avatarURL = member?.displayAvatarURL({ dynamic }) || user.displayAvatarURL({ dynamic });

    const username = member?.displayName || user.username;

    if (!channel?.permissionsFor(client.user as User)?.has(this.props?.clientPermissions as PermissionString[])) {
      const [, title, description] = content.match(this.pattern.embed) || [];

      const embeds = [new MessageEmbed()
        .setColor(member?.displayColor || 'RANDOM')
        .setFooter({ text: username, iconURL: avatarURL })
        .setTimestamp(Date.now())
        .setTitle(title)
        .setDescription(description)];

      return await interaction.reply({ embeds });
    }

    const webhook = await (channel as TextChannel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ||
      await (channel as TextChannel).createWebhook(client.user?.id as string);

    await webhook.send({ avatarURL, content, username });

    await interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
}