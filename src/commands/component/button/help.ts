import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { HelpButtonCustomId } from "../../../@types";
import commandHandler from "../../../handlers/CommandHandler";
import ButtonCommand from "../../../structures/ButtonCommand";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { HELP_PAGE_LIMIT } from "../../../util/constants";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "help",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"commands">parsedId.sc]?.(interaction);

    return;
  }

  async commands(interaction: ButtonInteraction) {
    const locale = interaction.locale;

    const parsedId = <HelpButtonCustomId>JSON.parse(interaction.customId);

    const commands = commandHandler.commandsByCategory.get(parsedId.cbc) ??
      commandHandler.chatInputApplicationCommands;

    const slashCommands = commands.toJSON().filter(c => !c.options.private);

    const components = interaction.message.components.map(row => {
      if (row.components[0].type !== ComponentType.Button) return row;

      if (row.components.every(element => element.customId !== interaction.customId)) return row;

      return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.setPageButtons({
          category: parsedId.cbc,
          page: parsedId.p,
          total: Math.floor(slashCommands.length / HELP_PAGE_LIMIT),
        }));
    });

    await interaction.update({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setFields(this.convertCommandsToEmbedFields(slashCommands, parsedId.p))
          .setFooter({ text: `Total: ${slashCommands.length}` })
          .setTitle(t("konanSupport", { locale }))],
    });

    return;
  }

  convertCommandsToEmbedFields(
    commands: ChatInputCommand[],
    page = 0,
    fields: APIEmbedField[] = [],
  ): APIEmbedField[] {
    for (let i = (page * HELP_PAGE_LIMIT); i < commands.length; i++) {
      const command = commands[i];

      fields.push({
        name: `${command.data.description}`.slice(0, 256),
        value: `${command}`.slice(0, 1024),
      });

      if (fields.length === HELP_PAGE_LIMIT) break;
    }

    return fields;
  }

  setPageButtons({ category, page, total }: { category: string; page: number; total: number }) {
    return [
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: "commands", p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel("<")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("{}")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`${page + 1}/${total + 1}`),
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: this.data.name, cbc: category, sc: "commands", p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel(">")
        .setStyle(ButtonStyle.Secondary),
    ];
  }
}
