import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionString, TextChannel, User } from 'discord.js';
import * as googleTTS from 'google-tts-api';
import { Client, SlashCommand } from '../../structures';

const dynamic = true;

export default class Say extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Fun',
      clientPermissions: ['MANAGE_WEBHOOKS'],
    });

    this.data = new SlashCommandBuilder().setName('say')
      .setDescription('Say something in TTS. - Powered by Google TTS.')
      .addStringOption(option => option.setName('message')
        .setDescription('The message to say')
        .setRequired(true));
  }

  async execute(interaction: CommandInteraction) {
    const { channel, client, locale, member, options, user } = <CommandInteraction<'cached'>>interaction;

    const message = options.getString('message', true);

    const url = googleTTS.getAudioUrl(message, {
      lang: locale.split(/_|-/)[0],
    });

    const avatarURL = member?.displayAvatarURL({ dynamic }) ?? user.displayAvatarURL({ dynamic });

    const username = member?.displayName ?? user.username;

    if (!channel?.permissionsFor(<User>client.user)?.has(this.props?.clientPermissions as PermissionString[])) {
      return await interaction.reply({ content: `${user} says:`, files: [{ attachment: url, name: 'say.mp3' }] });
    }

    const webhook = await (<TextChannel>channel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await (<TextChannel>channel).createWebhook(<string>client.user?.id);

    await webhook.send({ avatarURL, username, files: [{ attachment: url, name: 'say.mp3' }] });

    await interaction.reply({ content: ':heavy_check_mark:⠀', ephemeral: true });
  }
}