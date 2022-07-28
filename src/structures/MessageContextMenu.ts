import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class MessageContextMenu extends BaseApplicationCommand {
  data!: ContextMenuCommandBuilder;

  constructor() {
    super();
  }

  abstract execute(interaction: MessageContextMenuCommandInteraction): Promise<any>;
}