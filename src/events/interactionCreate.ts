import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelSelectMenuInteraction, ChatInputCommandInteraction, codeBlock, Colors, ComponentType, EmbedBuilder, InteractionType, MentionableSelectMenuInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, RouteBases, StringSelectMenuInteraction, UserContextMenuCommandInteraction, UserSelectMenuInteraction } from "discord.js";
import { env } from "node:process";
import { CommandTypes } from "../@enum";
import { BaseComponentCustomId } from "../@types";
import client, { appOwners, appStats, logger } from "../client";
import commandHandler from "../handlers/CommandHandler";
import BaseApplicationCommand from "../structures/BaseApplicationCommand";
import { t } from "../translator";
import { contentWithCodeBlockLength, getOptionFromInteractionOptions, JSONparse } from "../util/utils";

client.on("interactionCreate", async function (interaction) {
  const command = <BaseApplicationCommand>InteractionTypes[interaction.type]?.(<any>interaction);

  if (!command) return;

  if (!appOwners.isOwner(interaction.user.id)) {
    if (command.options.private) return;

    appStats.interactions++;
  }

  let execute = true;

  if ((command.options.channelAppPermissions ?? false) && "options" in interaction) {
    const getChannel = interaction.options.get("channel");

    const channelManager = interaction.guild?.channels ?? client.channels;

    const channel = getChannel?.channel ??
      channelManager.cache.get(`${getChannel?.value ?? ""}`) ??
      getOptionFromInteractionOptions(interaction.options.data,
        ApplicationCommandOptionType.Channel,
        channelManager) ??
      interaction.channel;

    if ("permissionsFor" in channel) {
      const appChannelPerms = channel.permissionsFor(client.user!)
        ?.missing(command.options.channelAppPermissions!);

      if (appChannelPerms?.length) {
        execute = false;
        await command.replyMissingPermission(interaction, appChannelPerms, "missingChannelPermission");
      }
    }
  }

  if (command.options.appPermissions) {
    const appPerms = interaction.appPermissions?.missing(command.options.appPermissions);

    if (appPerms?.length) {
      execute = false;
      await command.replyMissingPermission(interaction, appPerms, "missingPermission");
    }
  }

  try {
    if (execute) {
      await command.execute(interaction);
    }
  } catch (error: any) {
    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkRed)
        .setTitle("There was an error while executing this command!")
        .setDescription(codeBlock("c", `${error.name}: ${error.message}`
          .slice(0, contentWithCodeBlockLength("c"))))
        .setFooter(command.data?.name ? { text: command.data.name } : null)
        .setTimestamp(Date.now()),
    ];

    const components = [];

    if (env.DISCORD_GUILD_ID)
      components.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(t("supportServer", interaction.locale))
          .setURL(`${RouteBases.invite}/${env.GUILD_INVITE}`)));

    try {
      if (!interaction.isAutocomplete()) {
        if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
          await interaction.followUp({ components, embeds, ephemeral: true });
        } else if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ components, embeds });
        } else {
          await interaction.reply({ components, embeds, ephemeral: true });
        }
      }
    } catch { }

    await logger.interactionError(interaction, error);
  }

  return;
});

const InteractionTypes = {
  [InteractionType.ApplicationCommand]: (interaction: ChatInputCommandInteraction) =>
    ApplicationCommandTypes[interaction.commandType]?.(interaction),

  [InteractionType.MessageComponent]: (interaction: ButtonInteraction) =>
    ComponentTypes[interaction.componentType]?.(interaction),

  [InteractionType.ApplicationCommandAutocomplete]:
    (interaction: AutocompleteInteraction) => commandHandler.commands
      .get(CommandTypes.ApplicationAutocomplete)
      ?.get(interaction.commandName),

  [InteractionType.ModalSubmit]: function (interaction: ModalSubmitInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.Modal)
      ?.get(parsedId.c);
  },
};

const ApplicationCommandTypes = {
  [ApplicationCommandType.ChatInput]:
    (interaction: ChatInputCommandInteraction) => commandHandler.commands
      .get(CommandTypes.ApplicationChatInput)
      ?.get(interaction.commandName),

  [ApplicationCommandType.Message]:
    (interaction: MessageContextMenuCommandInteraction) => commandHandler.commands
      .get(CommandTypes.ApplicationContextMessage)
      ?.get(interaction.commandName),

  [ApplicationCommandType.User]:
    (interaction: UserContextMenuCommandInteraction) => commandHandler.commands
      .get(CommandTypes.ApplicationContextUser)
      ?.get(interaction.commandName),
};

const ComponentTypes = {
  [ComponentType.Button]: function (interaction: ButtonInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentButton)
      ?.get(parsedId.c);
  },

  [ComponentType.ChannelSelect]: function (interaction: ChannelSelectMenuInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentSelectChannel)
      ?.get(parsedId.c);
  },

  [ComponentType.MentionableSelect]: function (interaction: MentionableSelectMenuInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentSelectMentionable)
      ?.get(parsedId.c);
  },

  [ComponentType.RoleSelect]: function (interaction: RoleSelectMenuInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentSelectRole)
      ?.get(parsedId.c);
  },

  [ComponentType.StringSelect]: function (interaction: StringSelectMenuInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentSelectString)
      ?.get(parsedId.c);
  },

  [ComponentType.TextInput]: function (interaction: any) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentTextInput)
      ?.get(parsedId.c);
  },

  [ComponentType.UserSelect]: function (interaction: UserSelectMenuInteraction) {
    const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

    if (!parsedId?.c) return;

    return commandHandler.commands
      .get(CommandTypes.ComponentSelectUser)
      ?.get(parsedId.c);
  },
};
