import { codeBlock } from '@discordjs/builders';
import { AutocompleteInteraction, ButtonInteraction, CommandInteraction, ContextMenuInteraction, InteractionType, MessageActionRow, MessageButton, MessageComponentInteraction, MessageContextMenuInteraction, MessageEmbed, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import { ButtonComponentInteraction, Client, Event, MessageContextMenu, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

const { env } = process;
const { GUILD_INVITE } = env;

type InteractionTypes =
  AutocompleteInteraction |
  CommandInteraction |
  ContextMenuInteraction |
  MessageComponentInteraction

export default class InteractionCreate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'],
      name: 'interactionCreate',
    });
  }

  async execute(interaction: InteractionTypes) {
    const { client, locale, type } = interaction;

    const command = this[<Exclude<InteractionType, 'PING'>>type]?.(<any>interaction);

    if (!command) return;

    try {
      await command.execute(<any>interaction);
    } catch (error: any) {
      this.client.sendError(error);

      const embeds = [new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle(this.t('There was an error while executing this command!', { locale }))
        .setDescription(codeBlock('properties', `${error.name}: ${error.message}`))
        .setFooter({ text: command.data?.name || '-' })
        .setTimestamp(Date.now())];

      const components: MessageActionRow[] = [];

      if (GUILD_INVITE)
        components.push(new MessageActionRow()
          .setComponents(new MessageButton()
            .setStyle('LINK')
            .setLabel(this.t('supportServer', { locale }))
            .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`)));

      try {
        if (!interaction.isAutocomplete()) {
          if (interaction.replied) {
            await interaction.editReply({ components, embeds });
          } else {
            await interaction.reply({ components, embeds, ephemeral: true });
          }
        }
      } catch { null; }
    }
  }

  APPLICATION_COMMAND(interaction: CommandInteraction & ContextMenuInteraction) {
    return this[interaction.targetType || 'CHAT_INPUT']?.(<any>interaction);
  }

  APPLICATION_COMMAND_AUTOCOMPLETE(interaction: AutocompleteInteraction) {
    return this['CHAT_INPUT']?.(<any>interaction);
  }

  MESSAGE_COMPONENT(interaction: MessageComponentInteraction) {
    return this[interaction.componentType]?.(<any>interaction);
  }

  BUTTON(interaction: ButtonInteraction & { client: Client }): ButtonComponentInteraction {
    const { c, command } = JSON.parse(interaction.customId);
    return interaction.client.commands.button_component?.get(c ?? command);
  }

  CHAT_INPUT(interaction: CommandInteraction & { client: Client }): SlashCommand | undefined {
    return interaction.client.commands.slash_interaction?.get(interaction.commandName);
  }

  MESSAGE(interaction: MessageContextMenuInteraction & { client: Client }): MessageContextMenu {
    return interaction.client.commands.message_context?.get(interaction.commandName);
  }

  SELECT_MENU(interaction: SelectMenuInteraction & { client: Client }): SelectMenuComponentInteraction {
    const { c, command } = JSON.parse(interaction.customId);
    return interaction.client.commands.selectmenu_component?.get(c ?? command);
  }

  USER(interaction: UserContextMenuInteraction & { client: Client }): UserContextMenu {
    return interaction.client.commands.user_context?.get(interaction.commandName);
  }
}