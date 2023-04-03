import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits, Role } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { addButtonsByRoles, addButtonsToRows, createButtonsByRoles, editButtonById, removeButtonsById, reorganizeButtons } from "../../../util/commands/components/buttonroles";
import { componentsHasRoles, filterCustomId, getMessageComponentsAmount } from "../../../util/commands/components/utils";
import { GUILD_TEXT_CHANNEL_TYPES, INTERACTION_BUTTON_STYLES } from "../../../util/constants";
import regexp from "../../../util/regexp";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  CommandNameRegExp = /"c":"buttonroles"/;

  constructor() {
    super({
      category: "Moderation",
      appPermissions: ["EmbedLinks", "ManageRoles", "SendMessages"],
      userPermissions: ["ManageRoles"],
    });

    this.data.setName("buttonroles")
      .setDescription("Manage button roles.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .setNameLocalizations(getLocalizations("buttonrolesName"))
      .setDescriptionLocalizations(getLocalizations("buttonrolesDescription"))
      .addSubcommand(subcommand => subcommand.setName("create")
        .setDescription("Create a button role.")
        .setNameLocalizations(getLocalizations("buttonrolesCreateName"))
        .setDescriptionLocalizations(getLocalizations("buttonrolesCreateDescription"))
        .addRoleOption(option => option.setName("role")
          .setDescription("Select the role to use.")
          .setNameLocalizations(getLocalizations("buttonrolesCreateRoleName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateRoleDescription"))
          .setRequired(true))
        .addStringOption(option => option.setName("text")
          .setDescription("The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles")
          .setNameLocalizations(getLocalizations("buttonrolesCreateTextName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateTextDescription")))
        .addStringOption(option => option.setName("button_name")
          .setDescription("The name of the button. Button name {0,63} - default: <role>")
          .setNameLocalizations(getLocalizations("buttonrolesCreateButtonNameName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateButtonNameDescription"))
          .setMaxLength(63))
        .addStringOption(option => option.setName("button_emoji")
          .setDescription("The emoji of the button.")
          .setNameLocalizations(getLocalizations("buttonrolesCreateButtonEmojiName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateButtonEmojiDescription")))
        .addBooleanOption(option => option.setName("button_disabled")
          .setDescription("Whether the button is disabled.")
          .setNameLocalizations(getLocalizations("buttonrolesCreateButtonDisabledName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateButtonDisabledDescription")))
        .addIntegerOption(option => option.setName("button_style")
          .setDescription("Select the style of the button. default: Primary")
          .setNameLocalizations(getLocalizations("buttonrolesCreateButtonStyleName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateButtonStyleDescription"))
          .setChoices(...INTERACTION_BUTTON_STYLES))
        .addChannelOption(option => option.setName("channel")
          .setDescription("Select the channel. default: <current channel>")
          .setNameLocalizations(getLocalizations("buttonrolesCreateChannelName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesCreateChannelDescription"))
          .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("edit")
        .setDescription("Edit a button role.")
        .setNameLocalizations(getLocalizations("buttonrolesEditName"))
        .setDescriptionLocalizations(getLocalizations("buttonrolesEditDescription"))
        .addSubcommand(subcommand => subcommand.setName("message")
          .setDescription("Edit a text in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesEditMessageName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesEditMessageDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesEditMessageChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditMessageChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesEditMessageMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditMessageMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("text")
            .setDescription("Input new text. Title {0,256} | Description {0,4096}")
            .setNameLocalizations(getLocalizations("buttonrolesEditMessageTextName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditMessageTextDescription"))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("button")
          .setDescription("Edit a button in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesEditButtonName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("button")
            .setDescription("Select the button.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonButtonName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonButtonDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName("role")
            .setDescription("Select a new role.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonRoleName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonRoleDescription")))
          .addStringOption(option => option.setName("button_name")
            .setDescription("Input a new name. {0,63}")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonButtonNameName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonButtonNameDescription"))
            .setMaxLength(63))
          .addIntegerOption(option => option.setName("button_style")
            .setDescription("Select a new style.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonButtonStyleName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonButtonStyleDescription"))
            .setChoices(...INTERACTION_BUTTON_STYLES))
          .addStringOption(option => option.setName("button_emoji")
            .setDescription("Input a new emoji.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonButtonEmojiName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonButtonEmojiDescription")))
          .addBooleanOption(option => option.setName("button_disabled")
            .setDescription("Whether the button is disabled.")
            .setNameLocalizations(getLocalizations("buttonrolesEditButtonButtonDisabledName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesEditButtonButtonDisabledDescription")))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("add")
        .setDescription("Add to Button role.")
        .setNameLocalizations(getLocalizations("buttonrolesAddName"))
        .setDescriptionLocalizations(getLocalizations("buttonrolesAddDescription"))
        .addSubcommand(subcommand => subcommand.setName("button")
          .setDescription("Add a new button in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesAddButtonName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName("role")
            .setDescription("Select the role.")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonRoleName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonRoleDescription"))
            .setRequired(true))
          .addStringOption(option => option.setName("button_name")
            .setDescription("Input the name of the button. {0,63} - default: <role>")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonButtonNameName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonButtonNameDescription"))
            .setMaxLength(63))
          .addIntegerOption(option => option.setName("button_style")
            .setDescription("Select the style of the button. default: Primary")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonButtonStyleName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonButtonStyleDescription"))
            .setChoices(...INTERACTION_BUTTON_STYLES))
          .addStringOption(option => option.setName("button_emoji")
            .setDescription("Input the emoji of the button.")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonButtonEmojiName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonButtonEmojiDescription")))
          .addBooleanOption(option => option.setName("button_disabled")
            .setDescription("Whether the button is disabled.")
            .setNameLocalizations(getLocalizations("buttonrolesAddButtonButtonDisabledName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesAddButtonButtonDisabledDescription")))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("remove")
        .setDescription("Remove from a Button role.")
        .setNameLocalizations(getLocalizations("buttonrolesRemoveName"))
        .setDescriptionLocalizations(getLocalizations("buttonrolesRemoveDescription"))
        .addSubcommand(subcommand => subcommand.setName("button")
          .setDescription("Remove a button from a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesRemoveButtonName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesRemoveButtonDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesRemoveButtonChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesRemoveButtonChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesRemoveButtonMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesRemoveButtonMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("button")
            .setDescription("Select the button.")
            .setNameLocalizations(getLocalizations("buttonrolesRemoveButtonButtonName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesRemoveButtonButtonDescription"))
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("bulk")
        .setDescription("Bulk manage Button roles.")
        .setNameLocalizations(getLocalizations("buttonrolesBulkName"))
        .setDescriptionLocalizations(getLocalizations("buttonrolesBulkDescription"))
        .addSubcommand(subcommand => subcommand.setName("create")
          .setDescription("Create a bulk of buttons in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesBulkCreateName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesBulkCreateDescription"))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("buttonrolesBulkCreateRolesName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkCreateRolesDescription"))
            .setRequired(true))
          .addStringOption(option => option.setName("text")
            .setDescription("The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles")
            .setNameLocalizations(getLocalizations("buttonrolesBulkCreateTextName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkCreateTextDescription")))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel. default: <current channel>")
            .setNameLocalizations(getLocalizations("buttonrolesBulkCreateChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkCreateChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)))
        .addSubcommand(subcommand => subcommand.setName("add")
          .setDescription("Add to a bulk of buttons in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesBulkAddName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesBulkAddDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesBulkAddChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkAddChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)
            .setRequired(true))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesBulkAddMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkAddMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("buttonrolesBulkAddRolesName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkAddRolesDescription"))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("remove")
          .setDescription("Remove from a bulk of buttons in a Button role.")
          .setNameLocalizations(getLocalizations("buttonrolesBulkRemoveName"))
          .setDescriptionLocalizations(getLocalizations("buttonrolesBulkRemoveDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("buttonrolesBulkRemoveChannelName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkRemoveChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)
            .setRequired(true))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("buttonrolesBulkRemoveMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkRemoveMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("buttonrolesBulkRemoveRolesName"))
            .setDescriptionLocalizations(getLocalizations("buttonrolesBulkRemoveRolesDescription"))
            .setRequired(true))));
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommandGroup() ??
      interaction.options.getSubcommand();

    await this[<"create">subcommand]?.(interaction);

    return;
  }

  async create(interaction: ChatInputCommandInteraction<"cached">) {
    const locale = interaction.locale;

    const role = interaction.options.getRole("role");
    const button_emoji = interaction.options.getString("button_emoji") ?? {};
    const button_disabled = Boolean(interaction.options.getBoolean("button_disabled"));
    const button_name = interaction.options.getString("button_name") ?? role?.name.slice(0, 63);
    const button_style = interaction.options.getInteger("button_style") ?? ButtonStyle.Primary;
    const channel = <GuildTextBasedChannel>interaction.options.getChannel("channel") ?? interaction.channel;
    const [, title, description] = interaction.options.getString("text")?.match(regexp.embed) ?? [];

    try {
      await channel.send({
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setCustomId(JSON.stringify({
                  c: this.data.name,
                  count: 0,
                  id: role?.id,
                }))
                .setDisabled(button_disabled)
                .setEmoji(button_emoji)
                .setLabel(`${button_name} 0`)
                .setStyle(button_style),
            ]),
        ],
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(description?.replace(/(\s{2})/g, "\n") || null)
            .setTitle(title ? title : description ? null : "ButtonRoles"),
        ],
      });
    } catch (error) {
      await interaction.editReply(t("createError", { locale, string: "Button Role" }));
      throw error;
    }

    await interaction.editReply(t("?created", { locale, string: "Button Role" }));
    return;
  }

  async edit(interaction: ChatInputCommandInteraction<"cached">) {
    const locale = interaction.locale;

    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")
      ?.match(regexp.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "message") {
      const [, title, description] = interaction.options.getString("text")?.match(regexp.embed) ?? [];

      try {
        await message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Random")
              .setDescription(description?.replace(/(\s{2})/g, "\n") || null)
              .setTitle(title || null),
          ],
        });
      } catch (error) {
        await interaction.editReply(t("editError", { locale, string: "Button Role" }));
        throw error;
      }

      await interaction.editReply(t("?edited", { locale, string: "Button Role" }));
      return;
    }

    if (subcommand === "button") {
      const role = interaction.options.getRole("role");

      if (role ? componentsHasRoles(message.components, role) : false) {
        await interaction.editReply(t("editError", { locale, string: "Button Role" }));
        return 1;
      }

      const buttonId = interaction.options.getString("button");
      const button_disabled = interaction.options.getBoolean("button_disabled");
      const button_emoji = interaction.options.getString("button_emoji");
      const button_name = interaction.options.getString("button_name");
      const button_style = interaction.options.getInteger("button_style");

      const components = editButtonById(message.components, buttonId!, {
        button_disabled,
        button_emoji,
        button_name,
        button_style,
        role,
      });

      try {
        await message.edit({ components });
      } catch (error) {
        await interaction.editReply(t("editError", { locale, string: "Button Role" }));
        throw error;
      }

      await interaction.editReply(t("?edited", { locale, string: "Button Role" }));
      return;
    }
  }

  async add(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")
      ?.match(regexp.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const role = interaction.options.getRole("role");

    if (role ? componentsHasRoles(message.components, role) : true) {
      await interaction.editReply(t("itemAddError", interaction.locale));
      return 1;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "button") {
      const button_disabled = Boolean(interaction.options.getBoolean("button_disabled"));
      const button_emoji = interaction.options.getString("button_emoji") ?? {};
      const button_name = interaction.options.getString("button_name") ?? role?.name.slice(0, 63);
      const button_style = interaction.options.getInteger("button_style") ?? ButtonStyle.Primary;

      try {
        await message.edit({
          components: addButtonsToRows(message.components, [
            new ButtonBuilder()
              .setCustomId(JSON.stringify({
                c: this.data.name,
                count: 0,
                id: role?.id,
              }))
              .setDisabled(button_disabled)
              .setEmoji(button_emoji)
              .setLabel(`${button_name} 0`)
              .setStyle(button_style),
          ]),
        });
      } catch (error) {
        await interaction.editReply(t("buttonAddError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("buttonAdded", interaction.locale));
      return;
    }
  }

  async remove(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")
      ?.match(regexp.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "button") {
      const buttonId = interaction.options.getString("button");

      const components = reorganizeButtons(removeButtonsById(message.components, [buttonId!]));

      try {
        await message.edit({ components });
      } catch (error) {
        await interaction.editReply(t("buttonRemoveError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("buttonRemoved", interaction.locale));
      return;
    }
  }

  async bulk(interaction: ChatInputCommandInteraction<"cached">) {
    const subcommand = interaction.options.getSubcommand();

    await this[`bulk_${<"create">subcommand}`]?.(interaction);

    return;
  }

  async bulk_create(interaction: ChatInputCommandInteraction<"cached">) {
    const locale = interaction.locale;

    const channel = interaction.options.getChannel("channel") ?? interaction.channel;
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const ids = interaction.options.getString("roles")?.match(/\d{17,}/g) ?? [];

    const rolesId = Array.from(new Set(ids)).map(id => interaction.guild.roles.fetch(id));

    if (!rolesId.length) {
      await interaction.editReply(t("noIdsInRoleInput", interaction.locale));
      return 1;
    }

    const roles = await Promise.all(rolesId)
      .then(rs => <Role[]>rs.filter(r => r).slice(0, 25));

    if (!roles.length) {
      await interaction.editReply(t("noNewRoleFoudInRoleInput", interaction.locale));
      return 1;
    }

    const [, title, description] = interaction.options.getString("text")?.match(regexp.embed) ?? [];

    try {
      await channel.send({
        components: createButtonsByRoles({ roles }),
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(description?.replace(/(\s{2})/g, "\n") || null)
            .setTitle(title ? title : description ? null : "ButtonRoles"),
        ],
      });
    } catch (error) {
      await interaction.editReply(t("createError", { locale, string: "Button Role" }));
      throw error;
    }

    await interaction.editReply(t("?created", { locale, string: "Button Role" }));
    return;
  }

  async bulk_add(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const rowsAmount = getMessageComponentsAmount(message.components);

    if (rowsAmount.buttons === 25) {
      return 1;
    }

    const rolesId = interaction.options.getString("roles")?.match(/\d{17,}/g);
    if (!rolesId) {
      await interaction.editReply(t("noIdsInRoleInput", interaction.locale));
      return 1;
    }

    const roles = await Promise.all(filterCustomId(message.components, rolesId)
      .map(id => interaction.guild.roles.fetch(id)))
      .then(rs => <Role[]>rs.filter(r => r).slice(0, 25));
    if (!roles.length) {
      await interaction.editReply(t("noNewRoleFoudInRoleInput", interaction.locale));
      return 1;
    }

    try {
      await message.edit({
        components: addButtonsByRoles({ roles }, message.components).slice(0, 5),
      });
    } catch (error) {
      await interaction.editReply(t("buttonAddError", interaction.locale));
      throw error;
    }

    await interaction.editReply(t("buttonAdded", interaction.locale));
    return;
  }

  async bulk_remove(interaction: ChatInputCommandInteraction<"cached">) {
    const rolesId = interaction.options.getString("roles")?.match(/\d{17,}/g);
    if (!rolesId) {
      await interaction.editReply(t("noIdsInRoleInput", interaction.locale));
      return 1;
    }

    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];

    const message = await channel.messages.fetch(message_id).catch(() => null);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const components = reorganizeButtons(removeButtonsById(message.components, rolesId));

    try {
      await message.edit({ components });
    } catch (error) {
      await interaction.editReply(t("buttonRemoveError", interaction.locale));
      throw error;
    }

    await interaction.editReply(t("buttonRemoved", interaction.locale));
    return;
  }
}
