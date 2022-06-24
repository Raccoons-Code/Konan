import { codeBlock } from '@discordjs/builders';
import { AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, ContextMenuInteraction, InteractionType, MessageActionRow, MessageButton, MessageComponentInteraction, MessageContextMenuInteraction, MessageEmbed, ModalSubmitInteraction, SelectMenuInteraction, UserContextMenuInteraction } from 'discord.js';
import { env } from 'node:process';
import { AnyInteraction } from '../@types';
import { ButtonComponentInteraction, Event, MessageContextMenu, ModalSubmit, SelectMenuComponentInteraction, SlashCommand, UserContextMenu } from '../structures';

const { GUILD_INVITE } = env;

export default class InteractionCreate extends Event {
  constructor(client: Client) {
    super(client, {
      intents: ['GUILDS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'],
      name: 'interactionCreate',
    });
  }

  async execute(interaction: AnyInteraction) {
    const { client, locale, type } = interaction;

    const command = this[<Exclude<InteractionType, 'PING'>>type]?.(<any>interaction);

    if (!command) return;

    try {
      await command.execute(<any>interaction);
    } catch (error: any) {
      client.sendError(error);

      const embeds = [
        new MessageEmbed()
          .setColor('DARK_RED')
          .setTitle(this.t('There was an error while executing this command!', { locale }))
          .setDescription(codeBlock('properties', `${error.name}: ${error.message}`))
          .setFooter({ text: command.data?.name || '-' })
          .setTimestamp(Date.now()),
      ];

      const components: MessageActionRow[] = [];

      if (GUILD_INVITE)
        components.push(new MessageActionRow()
          .setComponents(new MessageButton()
            .setStyle('LINK')
            .setLabel(this.t('supportServer', { locale }))
            .setURL(`${client.options.http?.invite}/${GUILD_INVITE}`)));

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
  }

  APPLICATION_COMMAND(interaction: CommandInteraction & ContextMenuInteraction) {
    return this[interaction.targetType || 'TEXT_INPUT']?.(<any>interaction);
  }

  APPLICATION_COMMAND_AUTOCOMPLETE(interaction: AutocompleteInteraction) {
    return this['TEXT_INPUT']?.(interaction);
  }

  MESSAGE_COMPONENT(interaction: MessageComponentInteraction) {
    return this[interaction.componentType]?.(<any>interaction);
  }

  MODAL_SUBMIT(interaction: ModalSubmitInteraction): ModalSubmit {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return interaction.client.commands.modal_component?.get(c ?? command);
  }

  BUTTON(interaction: ButtonInteraction): ButtonComponentInteraction {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return interaction.client.commands.button_component?.get(c ?? command);
  }

  MESSAGE(interaction: MessageContextMenuInteraction): MessageContextMenu {
    return interaction.client.commands.message_context?.get(interaction.commandName);
  }

  SELECT_MENU(interaction: SelectMenuInteraction): SelectMenuComponentInteraction {
    const { c, command } = this.Util.parseJSON(interaction.customId) ?? {};

    return interaction.client.commands.selectmenu_component?.get(c ?? command);
  }

  TEXT_INPUT(interaction: CommandInteraction | AutocompleteInteraction): SlashCommand | undefined {
    return interaction.client.commands.slash_interaction?.get(interaction.commandName);
  }

  USER(interaction: UserContextMenuInteraction): UserContextMenu {
    return interaction.client.commands.user_context?.get(interaction.commandName);
  }
}