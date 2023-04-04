import { APIActionRowComponent, APIButtonComponent, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ButtonStyle, ComponentType } from "discord.js";
import client from "../../client";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";
import regexp from "../../util/regexp";
import { JSONparse } from "../../util/utils";

export default class extends ChatInputAutocomplete {
  CommandNameRegExp = /"c":"buttonroles"/;

  constructor() {
    super({
      name: "buttonroles",
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
      const messages = await channel.messages.fetch({ limit: 100 });

      messages.sweep(msg => msg.author.id !== client.user?.id ||
        msg.components.every(c => !this.CommandNameRegExp.test(c.components[0].customId!)));

      for (const message of messages.values()) {
        const [embed] = message.embeds;

        const name = [
          message.id,
          embed.title ? ` | ${embed.title}` : "",
          embed.description ? ` | ${embed.description}` : "",
        ].join("");

        if ((embed.title || embed.description) && pattern.test(name)) {
          res.push({
            name: name.slice(0, 100),
            value: message.id,
          });

          if (res.length === 25) break;
        }
      }

      return res;
    }

    const message_id = interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];
    if (!message_id) return res;

    if (focused.name === "button") {
      const message = await channel.messages.fetch(message_id).catch(() => null);
      if (!message?.editable) return res;

      for (let i = 0; i < message.components.length; i++) {
        const rowJson = <APIActionRowComponent<APIButtonComponent>>message.components[i].toJSON();

        if (rowJson.components[0].type !== ComponentType.Button) continue;

        for (let j = 0; j < rowJson.components.length; j++) {
          const button = rowJson.components[j];

          if (button.style === ButtonStyle.Link) continue;

          const parsedId = JSONparse(button.custom_id);
          if (!(parsedId?.id ?? parsedId?.roleId)) continue;

          const role = interaction.guild.roles.cache.get(parsedId.id ?? parsedId.roleId);

          const name = [
            `${i + 1} - ${j + 1}`,
            button.emoji?.id ? "" : button.emoji?.name,
            button.label ? ` | ${button.label}` : "",
            role ? ` | ${role.name}` : "",
            ` | ${parsedId.id ?? parsedId.roleId}`,
            ` | ${ButtonStyle[button.style]}`,
            button.disabled ? " | disabled" : "",
          ].join("");

          if (pattern.test(name))
            res.push({
              name: name.slice(0, 100),
              value: button.custom_id,
            });
        }
      }

      return res;
    }

    return res;
  }

  async add(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
  }

  async remove(interaction: AutocompleteInteraction<"cached">) {
    return this.edit(interaction);
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
}
