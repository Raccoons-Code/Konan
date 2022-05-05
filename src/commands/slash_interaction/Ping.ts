import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Ping extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('ping')
      .setDescription('Replies with Pong!');
  }

  async execute(interaction: CommandInteraction) {
    const sent = await interaction.reply({ content: 'Pong!', ephemeral: true, fetchReply: true }) as Message;

    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setFields([
        { name: ':signal_strength:', value: `**\`${interaction.client.ws.ping}\`ms**`, inline: true },
        { name: ':robot:', value: `**\`${ping}\`ms**`, inline: true },
      ])];

    await interaction.editReply({ embeds });

    console.log(`Ping: ${ping}ms`);
  }
}