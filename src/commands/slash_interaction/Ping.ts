import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Ping extends SlashCommand {
  constructor() {
    super({
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('ping')
      .setDescription('Replies with Pong!')
      .setNameLocalizations(this.getLocalizations('pingName'));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const sent = await interaction.reply({ content: 'Pong!', ephemeral: true, fetchReply: true });

    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setFields([
            { name: ':signal_strength:', value: `**\`${interaction.client.ws.ping}\`ms**`, inline: true },
            { name: ':robot:', value: `**\`${ping}\`ms**`, inline: true },
          ]),
      ],
    });
  }
}