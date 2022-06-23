import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, TextChannel } from 'discord.js';
import * as googleTTS from 'google-tts-api';
import { SlashCommand } from '../../structures';

const dynamic = true;

export default class Say extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Fun',
      clientPermissions: ['MANAGE_WEBHOOKS'],
    });

    this.data = new SlashCommandBuilder().setName('say')
      .setDescription('Say something in TTS. - Powered by Google TTS.')
      .setNameLocalizations(this.getLocalizations('sayName'))
      .setDescriptionLocalizations(this.getLocalizations('sayDescription'))
      .addStringOption(option => option.setName('message')
        .setDescription('The message to say.')
        .setNameLocalizations(this.getLocalizations('sayMessageName'))
        .setDescriptionLocalizations(this.getLocalizations('sayMessageDescription'))
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

    if (!channel?.permissionsFor(client.user!)?.has(this.props!.clientPermissions!))
      return interaction.reply({ content: `${user} says:`, files: [{ attachment: url, name: 'say.mp3' }] });

    const webhook = await (<TextChannel>channel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await (<TextChannel>channel).createWebhook(<string>client.user?.id);

    await webhook.send({ avatarURL, username, files: [{ attachment: url, name: 'say.mp3' }] });

    return interaction.reply({ content: '☑️', ephemeral: true }).catch(() => null);
  }
}