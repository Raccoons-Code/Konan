import { codeBlock } from '@discordjs/builders';
import { AutocompleteInteraction, ButtonInteraction, CommandInteraction, ContextMenuInteraction, Interaction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageContextMenuInteraction, MessageEmbed, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import { ButtonComponentInteraction, Client, Event, MessageContextMenu, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

const { env } = process;
const { GUILD_INVITE } = env;

export default class InteractionCreate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS'],
      name: 'interactionCreate',
    });
  }

  async execute(interaction: InteractionTypes) {
    const { client, locale, targetType, componentType } = interaction as CommandInteraction & ContextMenuInteraction & MessageComponentInteraction;

    const command = this[targetType || componentType || 'CHAT_INPUT']?.(interaction as any);

    if (!command) return;

    try {
      await command.execute(interaction as any);
    } catch (error: any) {
      this.client.sendError(error);

      const embeds: MessageEmbed[] = [new MessageEmbed()
        .setColor('DARK_RED')
        .setTitle(this.t('There was an error while executing this command!', { locale }))
        .setDescription(codeBlock('properties', `${error.name}: ${error.message}`))
        .setFooter({ text: command.data?.name || '-' })
        .setTimestamp(Date.now())];

      const components: MessageActionRow[] = [];

      if (GUILD_INVITE)
        components.push(new MessageActionRow().setComponents(new MessageButton().setStyle('LINK')
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

  BUTTON({ client, customId }: ButtonInteraction & { client: Client }) {
    const { c, command } = JSON.parse(customId);
    return client.commands.button_component?.get(c || command) as ButtonComponentInteraction;
  }

  CHAT_INPUT({ client, commandName }: CommandInteraction & { client: Client }) {
    return client.commands.slash_interaction?.get(commandName) as SlashCommand;
  }

  MESSAGE({ client, commandName }: MessageContextMenuInteraction & { client: Client }) {
    return client.commands.message_context?.get(commandName) as MessageContextMenu;
  }

  SELECT_MENU({ client, customId }: SelectMenuInteraction & { client: Client }) {
    const { c, command } = JSON.parse(customId);
    return client.commands.selectmenu_component?.get(c || command) as SelectMenuComponentInteraction;
  }

  USER({ client, commandName }: UserContextMenuInteraction & { client: Client }) {
    return client.commands.user_context?.get(commandName) as UserContextMenu;
  }
}

export type InteractionTypes = Interaction & (CommandInteraction | AutocompleteInteraction | ContextMenuInteraction | MessageComponentInteraction)