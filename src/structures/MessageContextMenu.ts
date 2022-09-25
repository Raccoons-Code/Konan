import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class MessageContextMenu extends BaseApplicationCommand {
  data = new ContextMenuCommandBuilder();

  constructor() {
    super();
  }

  build() {
    return this.data;
  }

  abstract execute(interaction: MessageContextMenuCommandInteraction): Promise<any>;
}