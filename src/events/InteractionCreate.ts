import { ActionRowBuilder, ApplicationCommandType, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, codeBlock, Colors, CommandInteraction, ComponentType, EmbedBuilder, InteractionType, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, RouteBases, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { env } from 'node:process';
/* import { ShardingClient } from 'statcord.js'; */
import type { AnyInteraction } from '../@types';
import { logger } from '../client';
import commandHandler from '../commands';
import { ButtonComponentInteraction, Event, MessageContextMenu, ModalSubmit, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

const codeBlockLength = codeBlock('properties', '').length;
const descriptionLength = 4096 - codeBlockLength;

export default class InteractionCreate extends Event<'interactionCreate'> {
  constructor() {
    super({
      intents: ['Guilds', 'GuildIntegrations', 'GuildWebhooks'],
      name: 'interactionCreate',
    });
  }

  async execute(interaction: AnyInteraction) {
    const { client, locale, type/* , user */ } = interaction;

    const command = this[<Extract<keyof typeof InteractionType, keyof InteractionCreate>>
      InteractionType[type]]?.(<any>interaction);

    if (!command) return;

    try {
      await command.execute(<any>interaction);
    } catch (error: any) {
      if ([40060].includes(error.code))
        return console.error(error);

      logger.interactionError({
        client,
        commandName: command.data.name,
        commandType: (<CommandInteraction>interaction).commandType,
        componentType: (<MessageComponentInteraction>interaction).componentType,
        error,
        options: (<any>interaction).options,
        type,
      });

      const embeds = [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setTitle(this.t('There was an error while executing this command!', { locale }))
          .setDescription(codeBlock('properties', `${error.name}: ${error.message}`.slice(0, descriptionLength)))
          .setFooter({ text: command.data?.name ?? '' })
          .setTimestamp(Date.now()),
      ];

      const components = [];

      if (env.GUILD_INVITE)
        components.push(new ActionRowBuilder<ButtonBuilder>()
          .setComponents(new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(this.t('supportServer', { locale }))
            .setURL(`${RouteBases.invite}/${env.GUILD_INVITE}`)));

      try {
        if (!interaction.isAutocomplete()) {
          if (interaction.isMessageComponent()) {
            await interaction.followUp({ components, embeds, ephemeral: true });
          } else if (interaction.replied) {
            await interaction.editReply({ components, embeds });
          } else {
            await interaction.reply({ components, embeds, ephemeral: true });
          }
        }
      } catch { null; }
    }

    /* if (env.NODE_ENV === 'production' && !await client.owners.isOwner(user.id)) {
      if (env.STATCORD_KEY)
        ShardingClient.postCommand(command.data.name, user.id, client);
    } */
  }

  ApplicationCommand(interaction: CommandInteraction) {
    return this[<Extract<keyof typeof ApplicationCommandType, keyof InteractionCreate>>
      ApplicationCommandType[interaction.commandType]]?.(<any>interaction);
  }

  MessageComponent(interaction: MessageComponentInteraction) {
    return this[<Extract<keyof typeof ComponentType, keyof InteractionCreate>>
      ComponentType[interaction.componentType]]?.(<any>interaction);
  }

  ModalSubmit(interaction: ModalSubmitInteraction): ModalSubmit | undefined {
    const { c, command } = this.Util.JSONparse(interaction.customId) ?? {};

    return commandHandler.commands.modal_component?.get(c ?? command);
  }

  ApplicationCommandAutocomplete(interaction: AutocompleteInteraction): SlashCommand | undefined {
    return commandHandler.commands.slash_autocomplete?.get(interaction.commandName);
  }

  Button(interaction: ButtonInteraction): ButtonComponentInteraction | undefined {
    const { c, command } = this.Util.JSONparse(interaction.customId) ?? {};

    return commandHandler.commands.button_component?.get(c ?? command);
  }

  ChatInput(interaction: ChatInputCommandInteraction | AutocompleteInteraction): SlashCommand | undefined {
    return commandHandler.commands.slash_interaction?.get(interaction.commandName);
  }

  Message(interaction: MessageContextMenuCommandInteraction): MessageContextMenu | undefined {
    return commandHandler.commands.message_context?.get(interaction.commandName);
  }

  SelectMenu(interaction: SelectMenuInteraction): SelectMenuComponentInteraction | undefined {
    const { c, command } = this.Util.JSONparse(interaction.customId) ?? {};

    return commandHandler.commands.selectmenu_component?.get(c ?? command);
  }

  User(interaction: UserContextMenuCommandInteraction): UserContextMenu | undefined {
    return commandHandler.commands.user_context?.get(interaction.commandName);
  }
}