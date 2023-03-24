import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Utility",
    });

    this.data.setName("ping")
      .setDescription("Replies with Pong!");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("pingName"))
      .setDescriptionLocalizations(getLocalizations("pingDescription"));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "Pong!", ephemeral: true, fetchReply: true });

    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setFields([
            { name: ":signal_strength:", value: `**\`${interaction.client.ws.ping}\`ms**`, inline: true },
            { name: ":robot:", value: `**\`${ping}\`ms**`, inline: true },
          ]),
      ],
    });

    return;
  }
}
