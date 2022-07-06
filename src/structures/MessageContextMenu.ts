import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import BaseCommand from './BaseCommand';

export default abstract class MessageContextMenu extends BaseCommand {
  data!: ContextMenuCommandBuilder;

  constructor() {
    super();
  }

  abstract execute(interaction: MessageContextMenuCommandInteraction): Promise<any>;
}