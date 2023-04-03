import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder, OAuth2Scopes, RouteBases, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { env } from "node:process";
import client from "../../../../client";
import commandHandler from "../../../../handlers/CommandHandler";
import BaseCommand from "../../../../structures/BaseCommand";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import Translator, { t } from "../../../../translator";
import { HELP_PAGE_LIMIT } from "../../../../util/constants";
import { formatLocale } from "../../../../util/Locales";
import { mathRandom } from "../../../../util/utils";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "help",
    });
  }

  async execute(interaction: StringSelectMenuInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"home">parsedId.sc ?? interaction.values[0]]?.(interaction);

    return;
  }

  async home(interaction: StringSelectMenuInteraction<"cached">) {
    const locale = interaction.locale;

    const me = interaction.guild?.members.me ?? client.user;

    const avatarURL = me?.displayAvatarURL() || null;

    const buttons = [
      new ButtonBuilder()
        .setEmoji("📮") // :postbox:
        .setLabel(t("inviteLink", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(client.generateInvite({
          scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
          permissions: commandHandler.permissions,
        })),
    ];

    if (env.GUILD_INVITE)
      buttons.push(new ButtonBuilder()
        .setEmoji("🪤") // :mouse_trap:
        .setLabel(t("supportServer", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(`${RouteBases.invite}/${env.GUILD_INVITE}`));

    if (env.DONATE_LINK)
      buttons.push(new ButtonBuilder()
        .setEmoji("💸") // :money_with_wings:
        .setLabel(t("donate", interaction.locale))
        .setStyle(ButtonStyle.Link)
        .setURL(env.DONATE_LINK));

    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(new StringSelectMenuBuilder()
            .setCustomId(JSON.stringify({ c: this.data.name }))
            .setOptions(
              new StringSelectMenuOptionBuilder()
                .setDefault(true)
                .setEmoji("🏠")
                .setLabel("Home")
                .setValue("home"),
              new StringSelectMenuOptionBuilder()
                .setEmoji("🗃️")
                .setLabel("Commands")
                .setValue("commands"),
              new StringSelectMenuOptionBuilder()
                .setEmoji(["🌎", "🌏", "🌍"][mathRandom(3)])
                .setLabel("Languages")
                .setValue("localization"),
            )),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            t("helpText", {
              locale,
              user: interaction.user,
            })
            + "\n\n"
            + "[Terms of Service & Privacy](https://github.com/Raccoons-Code/Konan/wiki/Terms-of-Service-&-Privacy)",
          )
          .setThumbnail(avatarURL)
          .setTitle(t("konanSupport", interaction.locale)),
      ],
    });
  }

  async commands(interaction: StringSelectMenuInteraction<"cached">) {
    const commands = commandHandler.chatInputApplicationCommands;

    const slashCommands = commands.toJSON().filter((c) => !c.options.private);

    const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(this.setSelectCategory("general")),
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(this.setSelectMenu(1)),
    ];

    if (slashCommands.length > HELP_PAGE_LIMIT) {
      components.unshift(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.setPageButtons({
          category: "",
          page: 0,
          total: Math.floor(slashCommands.length / HELP_PAGE_LIMIT),
        })));
    }

    await interaction.update({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setFields(this.convertCommandsToEmbedFields(slashCommands))
          .setFooter({ text: `Total: ${slashCommands.length}` })
          .setTitle(t("konanSupport", interaction.locale))],
    });

    return;
  }

  async localization(interaction: StringSelectMenuInteraction<"cached">) {
    const description = Object.entries(Translator.options.stats!).reduce((acc, [key, value]) =>
      `${acc}\n${`${formatLocale(key).padStart(15)} = ${value}%`.padEnd(15)}`, "");

    await interaction.update({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(this.setSelectMenu(2)),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setDescription(codeBlock("css", description))
          .setTitle(t("konanSupport", interaction.locale)),
      ],
    });

    return;
  }

  setSelectMenu(i = 0) {
    return new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({ c: "help" }))
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setDefault(!i)
          .setEmoji("🏠")
          .setLabel("Home")
          .setValue("home"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === 1)
          .setEmoji("🗃️")
          .setLabel("Commands")
          .setValue("commands"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === 2)
          .setEmoji(["🌎", "🌏", "🌍"][mathRandom(3)])
          .setLabel("Languages")
          .setValue("localization"),
      );
  }

  setPageButtons({ category, page, total }: { category: string, page: number, total: number }) {
    return [
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: "help", cbc: category, sc: "commands", p: page - 1 }))
        .setDisabled(page < 1)
        .setLabel("<")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("{}")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`${page + 1}/${total + 1}`),
      new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: "help", cbc: category, sc: "commands", p: page + 1 }))
        .setDisabled(page >= total)
        .setLabel(">")
        .setStyle(ButtonStyle.Secondary),
    ];
  }

  convertCommandsToEmbedFields(
    commands: BaseCommand[],
    page = 0,
    fields: APIEmbedField[] = [],
  ): APIEmbedField[] {
    for (let i = (page * HELP_PAGE_LIMIT); i < commands.length; i++) {
      const command = commands[i];

      fields.push({
        name: `${command.data.description}`.slice(0, 256),
        value: `${command}`.slice(0, 1024),
        inline: false,
      });

      if (fields.length === HELP_PAGE_LIMIT) break;
    }

    return fields;
  }

  async setCommandCategory(interaction: StringSelectMenuInteraction<"cached">) {
    const commands = commandHandler.commandsByCategory.get(interaction.values[0]);

    const slashCommands = commands?.toJSON().filter((c: any) => !c.options?.private);

    const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [
      new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(this.setSelectCategory(interaction.values[0])),
      new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(this.setSelectMenu(1)),
    ];

    if (!slashCommands?.length) {
      await interaction.update({
        components,
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription("No commands found in this category.")
            .setFooter({ text: "Total: 0" })
            .setTitle(t("konanSupport", interaction.locale)),
        ],
      });
      return;
    }

    if (slashCommands.length > HELP_PAGE_LIMIT)
      components.unshift(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.setPageButtons({
          category: interaction.values[0],
          page: 0,
          total: Math.floor(slashCommands.length / HELP_PAGE_LIMIT),
        })));

    await interaction.update({
      components,
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setFields(this.convertCommandsToEmbedFields(slashCommands))
          .setFooter({ text: `Total: ${slashCommands.length}` })
          .setTitle(t("konanSupport", interaction.locale)),
      ],
    });

    return;
  }

  setSelectCategory(i: string | number = 0) {
    return new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({ c: "help", sc: "setCommandCategory", i }))
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setDefault(i === "General")
          .setEmoji("📝")
          .setLabel("General")
          .setValue("General"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === "Fun")
          .setEmoji("🤣")
          .setLabel("Fun")
          .setValue("Fun"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === "Game")
          .setEmoji("🎮")
          .setLabel("Games")
          .setValue("Game"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === "Moderation")
          .setEmoji("🛡️")
          .setLabel("Moderation")
          .setValue("Moderation"),
        new StringSelectMenuOptionBuilder()
          .setDefault(i === "Utility")
          .setEmoji("🧰")
          .setLabel("Utility")
          .setValue("Utility"),
      );
  }
}
