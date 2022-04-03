import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Ping extends SlashCommand {
  _ping: number;
  ping_: number;

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
    });

    this.data = new SlashCommandBuilder().setName('ping')
      .setDescription('Replies with Pong!');

    this._ping = Infinity;
    this.ping_ = -Infinity;
  }

  async execute(interaction: CommandInteraction) {
    const sent = await interaction.reply({ content: 'Pong!', ephemeral: true, fetchReply: true }) as Message;

    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    if (this._ping > ping) this._ping = ping;
    if (this.ping_ < ping) this.ping_ = ping;

    const embeds = [new MessageEmbed()
      .setColor('RANDOM')
      .setFields([
        { name: ':signal_strength:', value: `**\`${interaction.client.ws.ping}\`ms**` },
        { name: ':heavy_minus_sign:', value: `**\`${this._ping}\`ms**`, inline: true },
        { name: ':robot:', value: `**\`${ping}\`ms**`, inline: true },
        { name: ':heavy_plus_sign:', value: `**\`${this.ping_}\`ms**`, inline: true },
      ])];

    await interaction.editReply({ embeds });

    console.log(`Ping: ${ping}ms`);
  }
}