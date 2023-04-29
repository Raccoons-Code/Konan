import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits, Role, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import { addSelectOptionsToRows, removeOptionsFromSelectMenu } from "../../../util/commands/components/selectmenu";
import { addSelectByRoles, createSelectByRoles, editStringSelectById, removeOptionsByRolesFromSelect, setDefaultRole } from "../../../util/commands/components/selectroles";
import { componentsHasRoles, filterCustomId } from "../../../util/commands/components/utils";
import { GUILD_TEXT_CHANNEL_TYPES } from "../../../util/constants";
import regexp from "../../../util/regexp";
import { getLocalizations } from "../../../util/utils";

export default class extends ChatInputCommand {
  CommandNameRegExp = /"c":"selectroles"/;

  constructor() {
    super({
      category: "Moderation",
      appPermissions: ["ManageRoles"],
      channelAppPermissions: ["EmbedLinks", "SendMessages", "ViewChannel"],
      userPermissions: ["ManageRoles"],
    });

    this.data.setName("selectroles")
      .setDescription("Manage roles with a select menu.");
  }

  build() {
    this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .setNameLocalizations(getLocalizations("selectrolesName"))
      .setDescriptionLocalizations(getLocalizations("selectrolesDescription"))
      .addSubcommand(subcommand => subcommand.setName("create")
        .setDescription("Create a select menu.")
        .setNameLocalizations(getLocalizations("selectrolesCreateName"))
        .setDescriptionLocalizations(getLocalizations("selectrolesCreateDescription"))
        .addRoleOption(option => option.setName("role")
          .setDescription("Select a role to add to the select menu.")
          .setNameLocalizations(getLocalizations("selectrolesCreateRoleName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateRoleDescription"))
          .setRequired(true))
        .addStringOption(option => option.setName("option_name")
          .setDescription("The name of the option. {0,83} - default: <role>")
          .setNameLocalizations(getLocalizations("selectrolesCreateOptionNameName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateOptionNameDescription"))
          .setMaxLength(83))
        .addStringOption(option => option.setName("option_description")
          .setDescription("The description of the option. {0,100}")
          .setNameLocalizations(getLocalizations("selectrolesCreateOptionDescriptionName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateOptionDescriptionDescription"))
          .setMaxLength(100))
        .addBooleanOption(option => option.setName("option_default")
          .setDescription("Used to always add this role with other roles.")
          .setNameLocalizations(getLocalizations("selectrolesCreateOptionDefaultName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateOptionDefaultDescription")))
        .addStringOption(option => option.setName("option_emoji")
          .setDescription("The emoji of the option.")
          .setNameLocalizations(getLocalizations("selectrolesCreateOptionEmojiName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateOptionEmojiDescription")))
        .addBooleanOption(option => option.setName("menu_disabled")
          .setDescription("Whether the menu is disabled.")
          .setNameLocalizations(getLocalizations("selectrolesCreateMenuDisabledName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateMenuDisabledDescription")))
        .addStringOption(option => option.setName("menu_place_holder")
          .setDescription("The placeholder of the menu. {0,150}")
          .setNameLocalizations(getLocalizations("selectrolesCreateMenuPlaceHolderName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateMenuPlaceHolderDescription"))
          .setMaxLength(150))
        .addStringOption(option => option.setName("text")
          .setDescription("The text of the message. Title {0,256} | Description {0,4096} - default: SelectRoles")
          .setNameLocalizations(getLocalizations("selectrolesCreateTextName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateTextDescription")))
        .addChannelOption(option => option.setName("channel")
          .setDescription("The channel of the setup. default: <current channel>")
          .setNameLocalizations(getLocalizations("selectrolesCreateChannelName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesCreateChannelDescription"))
          .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("edit")
        .setDescription("Edit the Select roles.")
        .setNameLocalizations(getLocalizations("selectrolesEditName"))
        .setDescriptionLocalizations(getLocalizations("selectrolesEditDescription"))
        .addSubcommand(subcommand => subcommand.setName("message")
          .setDescription("Edit a text in a Select role.")
          .setNameLocalizations(getLocalizations("selectrolesEditMessageName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesEditMessageDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the message.")
            .setNameLocalizations(getLocalizations("selectrolesEditMessageChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMessageChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesEditMessageMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMessageMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("text")
            .setDescription("The text of the message. Title {0,256} | Description {0,4096}")
            .setNameLocalizations(getLocalizations("selectrolesEditMessageTextName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMessageTextDescription"))
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("menu")
          .setDescription("Edit a select menu.Edit the menu of the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesEditMenuName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the menu.")
            .setNameLocalizations(getLocalizations("selectrolesEditMenuChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesEditMenuMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("menu")
            .setDescription("Select the menu.")
            .setNameLocalizations(getLocalizations("selectrolesEditMenuMenuName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuMenuDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName("menu_disabled")
            .setDescription("Whether the menu is disabled.")
            .setNameLocalizations(getLocalizations("selectrolesEditMenuMenuDisabledName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuMenuDisabledDescription")))
          .addStringOption(option => option.setName("menu_place_holder")
            .setDescription("The place holder of the menu. {0,150}")
            .setNameLocalizations(getLocalizations("selectrolesEditMenuMenuPlaceHolderName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditMenuMenuPlaceHolderDescription"))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName("option")
          .setDescription("Edit the option of the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesEditOptionName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the option.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("menu")
            .setDescription("Select the menu of the option.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionMenuName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionMenuDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("option")
            .setDescription("Select the option.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionOptionName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionOptionDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName("role")
            .setDescription("Select a new role.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionRoleName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionRoleDescription")))
          .addStringOption(option => option.setName("option_name")
            .setDescription("Input a new name for the option. {0,83}")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionOptionNameName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionOptionNameDescription"))
            .setMaxLength(83))
          .addStringOption(option => option.setName("option_description")
            .setDescription("Input a new description for the option. {0,100}")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionOptionDescriptionName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionOptionDescriptionDescription"))
            .setMaxLength(100))
          .addBooleanOption(option => option.setName("option_default")
            .setDescription("Used to always add this role with other roles.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionOptionDefaultName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionOptionDefaultDescription")))
          .addStringOption(option => option.setName("option_emoji")
            .setDescription("Input a new emoji for the option.")
            .setNameLocalizations(getLocalizations("selectrolesEditOptionOptionEmojiName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesEditOptionOptionEmojiDescription")))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("add")
        .setDescription("Add to the Select roles.")
        .setNameLocalizations(getLocalizations("selectrolesAddName"))
        .setDescriptionLocalizations(getLocalizations("selectrolesAddDescription"))
        .addSubcommand(subcommand => subcommand.setName("menu")
          .setDescription("Add a menu to the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesAddMenuName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the menu.")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName("role")
            .setDescription("Select a role to add to the menu.")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuRoleName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuRoleDescription"))
            .setRequired(true))
          .addStringOption(option => option.setName("option_name")
            .setDescription("The name of the option. {0,83} - default: <role>")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuOptionNameName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuOptionNameDescription"))
            .setMaxLength(83))
          .addStringOption(option => option.setName("option_description")
            .setDescription("The description of the option. {0,100}")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuOptionDescriptionName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuOptionDescriptionDescription"))
            .setMaxLength(100))
          .addBooleanOption(option => option.setName("option_default")
            .setDescription("Used to always add this role with other roles.")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuOptionDefaultName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuOptionDefaultDescription")))
          .addStringOption(option => option.setName("option_emoji")
            .setDescription("The emoji of the option.")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuOptionEmojiName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuOptionEmojiDescription")))
          .addBooleanOption(option => option.setName("menu_disabled")
            .setDescription("Whether the menu is disabled.")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuMenuDisabledName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuMenuDisabledDescription")))
          .addStringOption(option => option.setName("menu_place_holder")
            .setDescription("The place holder of the menu. {0,150}")
            .setNameLocalizations(getLocalizations("selectrolesAddMenuMenuPlaceHolderName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddMenuMenuPlaceHolderDescription"))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName("option")
          .setDescription("Add an option to the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesAddOptionName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the option.")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("menu")
            .setDescription("Select the menu of the option.")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionMenuName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionMenuDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addRoleOption(option => option.setName("role")
            .setDescription("Select a role to add to the option.")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionRoleName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionRoleDescription"))
            .setRequired(true))
          .addStringOption(option => option.setName("option_name")
            .setDescription("The name of the option. {0,83} - default: <role>")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionOptionNameName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionOptionNameDescription"))
            .setMaxLength(83))
          .addStringOption(option => option.setName("option_description")
            .setDescription("The description of the option. {0,100}")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionOptionDescriptionName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionOptionDescriptionDescription"))
            .setMaxLength(100))
          .addBooleanOption(option => option.setName("option_default")
            .setDescription("Used to always add this role with other roles.")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionOptionDefaultName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionOptionDefaultDescription")))
          .addStringOption(option => option.setName("option_emoji")
            .setDescription("The emoji of the option.")
            .setNameLocalizations(getLocalizations("selectrolesAddOptionOptionEmojiName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesAddOptionOptionEmojiDescription")))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("remove")
        .setDescription("Remove from the Select roles.")
        .setNameLocalizations(getLocalizations("selectrolesRemoveName"))
        .setDescriptionLocalizations(getLocalizations("selectrolesRemoveDescription"))
        .addSubcommand(subcommand => subcommand.setName("menu")
          .setDescription("Remove a menu from the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesRemoveMenuName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesRemoveMenuDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the menu.")
            .setNameLocalizations(getLocalizations("selectrolesRemoveMenuChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveMenuChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesRemoveMenuMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveMenuMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("menu")
            .setDescription("Select the menu to remove.")
            .setNameLocalizations(getLocalizations("selectrolesRemoveMenuMenuName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveMenuMenuDescription"))
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("option")
          .setDescription("Remove an option from the Select roles.")
          .setNameLocalizations(getLocalizations("selectrolesRemoveOptionName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesRemoveOptionDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel of the option.")
            .setNameLocalizations(getLocalizations("selectrolesRemoveOptionChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveOptionChannelDescription"))
            .setRequired(true)
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesRemoveOptionMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveOptionMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("menu")
            .setDescription("Select the menu of the option.")
            .setNameLocalizations(getLocalizations("selectrolesRemoveOptionMenuName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveOptionMenuDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("option")
            .setDescription("Select the option to remove.")
            .setNameLocalizations(getLocalizations("selectrolesRemoveOptionOptionName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesRemoveOptionOptionDescription"))
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName("bulk")
        .setDescription("Bulk manage Select roles.")
        .setNameLocalizations(getLocalizations("selectrolesBulkName"))
        .setDescriptionLocalizations(getLocalizations("selectrolesBulkDescription"))
        .addSubcommand(subcommand => subcommand.setName("create")
          .setDescription("Create a bulk of interaction.options in a Select role.")
          .setNameLocalizations(getLocalizations("selectrolesBulkCreateName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateDescription"))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("selectrolesBulkCreateRolesName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateRolesDescription"))
            .setRequired(true))
          .addStringOption(option => option.setName("text")
            .setDescription("The Select Role text. Title {0,256} | Description {0,4096} - default: SelectRoles")
            .setNameLocalizations(getLocalizations("selectrolesBulkCreateTextName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateTextDescription")))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel. default: <current channel>")
            .setNameLocalizations(getLocalizations("selectrolesBulkCreateChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES))
          .addRoleOption(option => option.setName("default_role")
            .setDescription("Select the default role.")
            .setNameLocalizations(getLocalizations("selectrolesBulkCreateDefaultRoleName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateDefaultRoleDescription")))
          .addStringOption(option => option.setName("menu_place_holder")
            .setDescription("The menu place holder. {0,150}")
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkCreateMenuPlaceHolderDescription"))
            .setNameLocalizations(getLocalizations("selectrolesBulkCreateMenuPlaceHolderName"))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName("add")
          .setDescription("Add to a bulk of interaction.options in a Select role.")
          .setNameLocalizations(getLocalizations("selectrolesBulkAddName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("selectrolesBulkAddChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)
            .setRequired(true))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesBulkAddMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("selectrolesBulkAddRolesName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddRolesDescription"))
            .setRequired(true))
          .addRoleOption(option => option.setName("default_role")
            .setDescription("Select the default role.")
            .setNameLocalizations(getLocalizations("selectrolesBulkAddDefaultRoleName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddDefaultRoleDescription")))
          .addStringOption(option => option.setName("menu_place_holder")
            .setDescription("The menu place holder. {0,150}")
            .setNameLocalizations(getLocalizations("selectrolesBulkAddMenuPlaceHolderName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkAddMenuPlaceHolderDescription"))
            .setMaxLength(150)))
        .addSubcommand(subcommand => subcommand.setName("remove")
          .setDescription("Remove from a bulk of interaction.options in a Select role.")
          .setNameLocalizations(getLocalizations("selectrolesBulkRemoveName"))
          .setDescriptionLocalizations(getLocalizations("selectrolesBulkRemoveDescription"))
          .addChannelOption(option => option.setName("channel")
            .setDescription("Select the channel.")
            .setNameLocalizations(getLocalizations("selectrolesBulkRemoveChannelName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkRemoveChannelDescription"))
            .addChannelTypes(...GUILD_TEXT_CHANNEL_TYPES)
            .setRequired(true))
          .addStringOption(option => option.setName("message_id")
            .setDescription("Message ID | Message URL")
            .setNameLocalizations(getLocalizations("selectrolesBulkRemoveMessageIdName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkRemoveMessageIdDescription"))
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName("roles")
            .setDescription("Input the roles.")
            .setNameLocalizations(getLocalizations("selectrolesBulkRemoveRolesName"))
            .setDescriptionLocalizations(getLocalizations("selectrolesBulkRemoveRolesDescription"))
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

    const role = interaction.options.getRole("role", true);

    const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(role);

    if (typeof comparedRolePosition === "number" && comparedRolePosition < 1) {
      await interaction.followUp(t("roleManagementHierarchyError", interaction.locale));
      return;
    }

    const channel = <GuildTextBasedChannel>interaction.options.getChannel("channel") ?? interaction.channel;
    const option_description = interaction.options.getString("option_description") ?? undefined;
    const option_default = Boolean(interaction.options.getBoolean("option_default"));
    const option_emoji = interaction.options.getString("option_emoji") ?? {};
    const option_name = interaction.options.getString("option_name") ?? role.name.slice(0, 83);
    const menu_disabled = Boolean(interaction.options.getBoolean("menu_disabled"));
    const menu_place_holder = interaction.options.getString("menu_place_holder") || "";
    const [, title, description] = interaction.options.getString("text")?.match(regexp.embed) ?? [];

    try {
      await channel.send({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(new StringSelectMenuBuilder()
              .setCustomId(JSON.stringify({
                c: this.data.name,
                count: 0,
                d: Date.now(),
              }))
              .setDisabled(menu_disabled)
              .setOptions(new StringSelectMenuOptionBuilder({
                default: option_default,
                description: option_description,
                emoji: option_emoji,
                label: `${option_name} 0`,
                value: JSON.stringify({
                  count: 0,
                  id: role?.id,
                }),
              }))
              .setPlaceholder(menu_place_holder)),
        ],
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(description?.replace(/(\s{2})/g, "\n") || null)
            .setTitle(title ? title : description ? null : "SelectRoles"),
        ],
      });
    } catch (error) {
      await interaction.editReply(t("createError", { locale, string: "Select Role" }));
      throw error;
    }

    await interaction.editReply(t("?created", { locale, string: "Select Role" }));
    return;
  }

  async edit(interaction: ChatInputCommandInteraction<"cached">) {
    const locale = interaction.locale;

    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];

    const message = channel.messages.cache.get(message_id);
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
        await interaction.editReply(t("editError", { locale, string: "Select Role" }));
        throw error;
      }

      await interaction.editReply(t("?edited", { locale, string: "Select Role" }));
      return;
    }

    const menuId = interaction.options.getString("menu");

    if (subcommand === "menu") {
      const menu_disabled = interaction.options.getBoolean("menu_disabled") ?? undefined;
      const menu_place_holder = interaction.options.getString("menu_place_holder");

      try {
        await message.edit({
          components: editStringSelectById(message.components, menuId!, {
            menu_disabled,
            menu_place_holder,
          }),
        });
      } catch (error) {
        await interaction.editReply(t("editError", { locale, string: "Select Role" }));
        throw error;
      }

      await interaction.editReply(t("?edited", { locale, string: "Select Role" }));
      return;
    }

    const optionId = interaction.options.getString("option");

    if (subcommand === "option") {
      const role = interaction.options.getRole("role");

      if (role) {
        if (componentsHasRoles(message.components, role)) {
          await interaction.editReply(t("itemAddError", interaction.locale));
          return 1;
        }

        const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(role);

        if (typeof comparedRolePosition === "number" && comparedRolePosition < 1) {
          await interaction.followUp(t("roleManagementHierarchyError", interaction.locale));
          return 1;
        }
      }

      const option_default = interaction.options.getBoolean("option_default");
      const option_description = interaction.options.getString("option_description");
      const option_emoji = interaction.options.getString("option_emoji");
      const option_name = interaction.options.getString("option_name")?.slice(0, 83);

      try {
        await message.edit({
          components: editStringSelectById(message.components, menuId!, {
            role,
            option: {
              id: optionId,
              default: option_default,
              description: option_description,
              emoji: option_emoji,
              label: option_name,
            },
          }),
        });
      } catch (error) {
        await interaction.editReply(t("editError", { locale, string: "Select Role" }));
        throw error;
      }

      await interaction.editReply(t("?edited", { locale, string: "Select Role" }));
      return;
    }

    return;
  }

  async add(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];

    const message = channel.messages.cache.get(message_id);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const role = interaction.options.getRole("role");

    if (role) {
      if (componentsHasRoles(message.components, role)) {
        await interaction.editReply(t("itemAddError", interaction.locale));
        return 1;
      }

      const comparedRolePosition = interaction.guild.members.me?.roles.highest.comparePositionTo(role);

      if (typeof comparedRolePosition === "number" && comparedRolePosition < 1) {
        await interaction.followUp(t("roleManagementHierarchyError", interaction.locale));
        return 1;
      }
    }

    const option_default = interaction.options.getBoolean("option_default");
    const option_description = interaction.options.getString("option_description") ?? undefined;
    const option_emoji = interaction.options.getString("option_emoji");
    const option_name = interaction.options.getString("option_name") ?? role?.name.slice(0, 83);

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "menu") {
      const menu_disabled = Boolean(interaction.options.getBoolean("menu_disabled"));
      const menu_place_holder = interaction.options.getString("menu_place_holder") ?? "";

      let components = [
        ...message.components,
        new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(new StringSelectMenuBuilder()
            .setCustomId(JSON.stringify({
              c: this.data.name,
              count: 0,
              d: Date.now(),
            }))
            .setDisabled(menu_disabled)
            .setMaxValues(1)
            .setOptions(new StringSelectMenuOptionBuilder({
              default: Boolean(option_default),
              description: option_description,
              emoji: option_emoji ?? {},
              label: `${option_name} 0`,
              value: JSON.stringify({
                count: 0,
                id: role?.id,
              }),
            }))
            .setPlaceholder(menu_place_holder)),
      ];

      if (typeof option_default === "boolean") {
        components = setDefaultRole(components, role!);
      }

      try {
        await message.edit({
          components,
        });
      } catch (error) {
        await interaction.editReply(t("itemAddError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("itemAdded", interaction.locale));
      return;
    }

    const menuId = interaction.options.getString("menu");

    if (subcommand === "option") {
      let components = addSelectOptionsToRows(message.components, menuId!, [
        new StringSelectMenuOptionBuilder({
          default: Boolean(option_default),
          description: option_description,
          emoji: option_emoji ?? {},
          label: `${option_name} 0`,
          value: JSON.stringify({
            count: 0,
            id: role?.id,
          }),
        }),
      ]);

      if (typeof option_default === "boolean") {
        components = setDefaultRole(components, role!);
      }

      try {
        await message.edit({ components });
      } catch (error) {
        await interaction.editReply(t("itemAddError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("itemAdded", interaction.locale));
      return;
    }

    return;
  }

  async remove(interaction: ChatInputCommandInteraction<"cached">) {
    const channel = interaction.options.getChannel("channel");
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const message_id = <string>interaction.options.getString("message_id")?.match(regexp.messageURL)?.[1];

    const message = channel.messages.cache.get(message_id);
    if (!message) {
      await interaction.editReply(t("message404", interaction.locale));
      return 1;
    }
    if (!message.editable) {
      await interaction.editReply(t("messageNotEditable", interaction.locale));
      return 1;
    }

    const subcommand = interaction.options.getSubcommand();

    const menuId = interaction.options.getString("menu");

    if (subcommand === "menu") {
      try {
        await message.edit({
          components: message.components.filter(row => row.components[0].customId !== menuId),
        });
      } catch (error) {
        await interaction.editReply(t("itemRemoveError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("itemRemoved", interaction.locale));
      return;
    }

    const optionId = interaction.options.getString("option");

    if (subcommand === "option") {
      const components = removeOptionsFromSelectMenu(message.components, menuId!, optionId!);

      try {
        await message.edit({ components });
      } catch (error) {
        await interaction.editReply(t("itemRemoveError", interaction.locale));
        throw error;
      }

      await interaction.editReply(t("itemRemoved", interaction.locale));
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

    const ids = interaction.options.getString("roles")?.match(/\d{17,}/g) ?? [];

    const rolesId = Array.from(new Set(ids))
      .map(id => interaction.guild.roles.fetch(id));

    if (!rolesId.length) {
      await interaction.editReply(t("noIdsInRoleInput", interaction.locale));
      return 1;
    }

    const roles = await Promise.all(rolesId)
      .then(rs => <Role[]>rs.filter(role => role));

    if (interaction.guild.members.me) {
      const unmanageable: Role[] = [];

      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];

        if (interaction.guild.members.me!.roles.highest.comparePositionTo(role) < 1) {
          unmanageable.push(role);
          roles.splice(i, 1);
          i--;
        }
      }

      if (unmanageable.length) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(t("roleManagementHierarchyError", interaction.locale))
              .setDescription(unmanageable.join(" ")),
          ],
        });
      }
    }

    if (!roles.length) {
      await interaction.editReply(t("noNewRoleFoudInRoleInput", interaction.locale));
      return 1;
    }

    const defaultRole = interaction.options.getRole("default_role");
    const menuPlaceholder = interaction.options.getString("menu_place_holder");

    const channel = interaction.options.getChannel("channel") ?? interaction.channel;
    if (!channel?.isTextBased()) {
      await interaction.editReply(t("channel404", interaction.locale));
      return 1;
    }

    const [, title, description] = interaction.options.getString("text")?.match(regexp.embed) ?? [];

    try {
      await channel.send({
        components: createSelectByRoles({ roles, defaultRole, menuPlaceholder }),
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(description?.replace(/(\s{2})/g, "\n") || null)
            .setTitle(title ? title : description ? null : "SelectRoles"),
        ],
      });
    } catch (error) {
      await interaction.editReply(t("createError", { locale, string: "Select Role" }));
      throw error;
    }

    await interaction.editReply(t("?created", { locale, string: "Select Role" }));
    return;
  }

  async bulk_add(interaction: ChatInputCommandInteraction<"cached">) {
    const ids = interaction.options.getString("roles")?.match(/\d{17,}/g) ?? [];

    const rolesId = Array.from(new Set(ids));
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

    const roles = await Promise.all(filterCustomId(message.components, rolesId).map(id =>
      interaction.guild.roles.fetch(id))).then(rs => <Role[]>rs.filter(r => r).slice(0, 125));

    if (interaction.guild.members.me) {
      const unmanageable: Role[] = [];

      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];

        if (interaction.guild.members.me!.roles.highest.comparePositionTo(role) < 1) {
          unmanageable.push(role);
          roles.splice(i, 1);
          i--;
        }
      }

      if (unmanageable.length) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(t("roleManagementHierarchyError", interaction.locale))
              .setDescription(unmanageable.join(" ")),
          ],
        });
      }
    }

    if (!roles.length) {
      await interaction.editReply(t("noNewRoleFoudInRoleInput", interaction.locale));
      return 1;
    }

    const defaultRole = interaction.options.getRole("default_role");
    const menuPlaceholder = interaction.options.getString("menu_place_holder");

    const components = addSelectByRoles({ defaultRole, menuPlaceholder, roles }, message.components)
      .slice(0, 5);

    try {
      await message.edit({ components });
    } catch (error) {
      await interaction.editReply(t("itemAddError", interaction.locale));
      throw error;
    }

    await interaction.editReply(t("itemAdded", interaction.locale));
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

    try {
      await message.edit({
        components: removeOptionsByRolesFromSelect(rolesId, message.components),
      });
    } catch (error) {
      await interaction.editReply(t("itemRemoveError", interaction.locale));
      throw error;
    }

    await interaction.editReply(t("itemRemoved", interaction.locale));
    return;
  }
}
