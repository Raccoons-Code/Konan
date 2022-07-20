import { ActionRowBuilder, ApplicationCommandType, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, codeBlock, CommandInteraction, ComponentType, EmbedBuilder, InteractionType, MessageComponentInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, Partials, RouteBases, SelectMenuInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { env } from 'node:process';
import { ShardingClient } from 'statcord.js';
import { AnyInteraction } from '../@types';
import commandHandler from '../commands';
import { InteractionError } from '../errors';
import { ButtonComponentInteraction, Event, MessageContextMenu, ModalSubmit, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

const codeBlockLength = codeBlock('properties', '').length;
const descriptionLength = 4096 - codeBlockLength;

export default class InteractionCreate extends Event {
  constructor() {
    super({
      intents: ['Guilds', 'GuildBans', 'GuildIntegrations', 'GuildInvites', 'GuildVoiceStates', 'GuildWebhooks'],
      name: 'interactionCreate',
      partials: [Partials.ThreadMember],
    });
  }

  async execute(interaction: AnyInteraction) {
    const { client, locale, type, user } = interaction;

    const command = this[<Exclude<keyof typeof InteractionType, 'Ping'>>InteractionType[type]]?.(<any>interaction);

    if (!command) return;

    try {
      await command.execute(<any>interaction);
    } catch (error: any) {
      new InteractionError({
        client: client,
        commandName: command.data.name,
        commandType: (<CommandInteraction>interaction).commandType,
        componentType: (<MessageComponentInteraction>interaction).componentType,
        error: error,
        options: (<any>interaction).options,
        type: type,
      }).send();

      const embeds = [
        new EmbedBuilder()
          .setColor('DarkRed')
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
        if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) {
          if (interaction.type === InteractionType.MessageComponent) {
            await interaction.followUp({ components, embeds, ephemeral: true });
          } else if (interaction.replied) {
            await interaction.editReply({ components, embeds });
          } else {
            await interaction.reply({ components, embeds, ephemeral: true });
          }
        }
      } catch { null; }
    }

    if (env.NODE_ENV === 'production' && !await this.Util.getAppOwners.isOwner(client, user.id))
      ShardingClient.postCommand(command.data.name, user.id, client);
  }

  ApplicationCommand(interaction: CommandInteraction) {
    return this[<keyof typeof ApplicationCommandType>
      ApplicationCommandType[interaction.commandType]]?.(<any>interaction);
  }

  ApplicationCommandAutocomplete(interaction: AutocompleteInteraction) {
    return this['ChatInput']?.(interaction);
  }

  MessageComponent(interaction: MessageComponentInteraction) {
    return this[<Exclude<keyof typeof ComponentType, 'ActionRow' | 'TextInput'>>
      ComponentType[interaction.componentType]]?.(<any>interaction);
  }

  ModalSubmit(interaction: ModalSubmitInteraction): ModalSubmit {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return commandHandler.commands.modal_component?.get(c ?? command);
  }

  Button(interaction: ButtonInteraction): ButtonComponentInteraction {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return commandHandler.commands.button_component?.get(c ?? command);
  }

  ChatInput(interaction: ChatInputCommandInteraction | AutocompleteInteraction): SlashCommand {
    return commandHandler.commands.slash_interaction?.get(interaction.commandName);
  }

  Message(interaction: MessageContextMenuCommandInteraction): MessageContextMenu {
    return commandHandler.commands.message_context?.get(interaction.commandName);
  }

  SelectMenu(interaction: SelectMenuInteraction): SelectMenuComponentInteraction {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return commandHandler.commands.selectmenu_component?.get(c ?? command);
  }

  User(interaction: UserContextMenuCommandInteraction): UserContextMenu {
    return commandHandler.commands.user_context?.get(interaction.commandName);
  }
}