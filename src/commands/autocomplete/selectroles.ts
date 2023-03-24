import { APIActionRowComponent, APIStringSelectComponent, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ComponentType } from "discord.js";
import client from "../../client";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";
import regexp from "../../util/regexp";
import { JSONparse } from "../../util/utils";

export default class extends ChatInputAutocomplete {
  CommandNameRegExp = /"c":"selectroles"/;

  constructor() {
    super({
      name: "selectroles",
      appPermissions: ["EmbedLinks", "ManageRoles", "SendMessages"],
      userPermissions: ["ManageRoles"],
    });
  }

  async execute(interaction: AutocompleteInteraction) {
    if (!interaction.inCachedGuild()) {
      await interaction.respond([]);
      return 1;
    }

    const appPerms = interaction.appPermissions?.missing(this.data.appPermissions!);

    if (appPerms?.length) {
      await interaction.respond([]);
      return 1;
    }

    const subcommand = interaction.options.getSubcommandGroup() ??
      interaction.options.getSubcommand();

    const response = await this[<"edit">subcommand]?.(interaction);

    await interaction.respond(response);

    return;
  }

  async edit(
    interaction: AutocompleteInteraction<"cached">,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const channelId = <string>interaction.options.get("channel")?.value;
    if (!channelId) return res;

    const channel = await interaction.guild.channels.fetch(channelId);
    if (!channel?.isTextBased()) return res;

    const focused = interaction.options.getFocused(true);
    const pattern = RegExp(focused.value, "i");

    if (focused.name === "message_id") {
      const messages = await channel.messages.fetch({ limit: 100 })
        .then(msgs => msgs.toJSON().filter(msg =>
          msg.author.id === client.user?.id &&
          pattern.test(msg.id) &&
          msg.components.some(c => this.CommandNameRegExp.test(c.components[0].customId!))));

      for (const message of messages) {
        const [embed] = message.embeds;

        const name = [
          message.id,
          embed.title ? ` | ${embed.title}` : "",
          embed.description ? ` | ${embed.description}` : "",
        ].join("").slice(1, 100);

        if (pattern.test(name) && (embed.title || embed.description))
          res.push({
            name,
            value: message.id,
          });

        if (res.length === 25) break;
      }

      return res;
    }

    const message_id = interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];
    if (!message_id) return res;

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message?.editable) return res;

    if (focused.name === "menu") {
      for (let i = 0; i < message.components.length; i++) {
        const rowJson = <APIActionRowComponent<APIStringSelectComponent>>message.components[i].toJSON();

        if (rowJson.components[0].type !== ComponentType.StringSelect) continue;

        for (let j = 0; j < rowJson.components.length; j++) {
          const element = rowJson.components[j];

          const name = [
            `${i + 1} - ${j + 1}`,
            element.placeholder ? ` | ${element.placeholder}` : "",
            ` | ${element.options.length} ${element.options.length > 1 ? "options" : "option"}`,
            element.disabled ? " | disabled" : "",
          ].join("");

          if (pattern.test(name))
            res.push({
              name: name.slice(0, 100),
              value: element.custom_id,
            });
        }
      }

      return res;
    }

    if (focused.name === "option") {
      const menuId = interaction.options.getString("menu");

      if (!menuId) return res;

      for (let i = 0; i < message.components.length; i++) {
        const rowJson = <APIActionRowComponent<APIStringSelectComponent>>message.components[i].toJSON();

        if (rowJson.components[0].type !== ComponentType.StringSelect) continue;

        for (let j = 0; j < rowJson.components.length; j++) {
          const element = rowJson.components[j];

          if (element.custom_id !== menuId) continue;

          for (let k = 0; k < element.options.length; k++) {
            const option = element.options[k];

            const parsedValue = JSONparse(option.value);
            if (!(parsedValue?.id ?? parsedValue?.roleId)) continue;

            const role = interaction.guild.roles.cache.get(parsedValue.id ?? parsedValue.roleId);

            const name = [
              `${i + 1} - ${j + 1} - ${k + 1}`,
              option.emoji?.id ? "" : option.emoji?.name,
              option.label ? option.label : ` Option ${k + 1}`,
              role ? ` | ${role.name}` : "",
              ` | ${parsedValue.id ?? parsedValue.roleId}`,
              option.description ? ` | ${option.description}` : "",
            ].join("");

            if (pattern.test(name))
              res.push({
                name: name.slice(0, 100),
                value: option.value,
              });
          }
        }
      }

      return res;
    }

    return res;
  }

  async bulk(interaction: AutocompleteInteraction<"cached">): Promise<any> {
    return this[`bulk_${<"add">interaction.options.getSubcommand()}`]?.(interaction);
  }

  async bulk_add(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
  }

  async bulk_remove(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
  }

  async add(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
  }

  async remove(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
  }
}
