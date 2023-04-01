import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../database/prisma";
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
    const promises = [
      interaction.reply({ content: "Pong!", ephemeral: true, fetchReply: true }),
      prisma.user.count().then(() => Date.now()),
    ] as const;

    const [message, dbTimestamp] = await Promise.all(promises);

    const ping = message.createdTimestamp - interaction.createdTimestamp;
    const dbPing = dbTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setFields([{
            name: ":robot: My ping",
            value: `**\`${ping}\`ms**`,
          }, {
            name: ":signal_strength: Discord API",
            value: `**\`${interaction.client.ws.ping}\`ms**`,
          }, {
            name: ":elevator: Database",
            value: `**\`${dbPing}\`ms**`,
          }]),
      ],
    });

    return;
  }
}
