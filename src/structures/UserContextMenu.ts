import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class UserContextMenu extends BaseApplicationCommand {
  data = new ContextMenuCommandBuilder();

  constructor() {
    super();
  }

  build() {
    return this.data;
  }

  abstract execute(interaction: UserContextMenuCommandInteraction): Promise<any>;
}