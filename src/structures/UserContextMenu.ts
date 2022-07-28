import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import BaseApplicationCommand from './BaseApplicationCommand';

export default abstract class UserContextMenu extends BaseApplicationCommand {
  data!: ContextMenuCommandBuilder;

  constructor() {
    super();
  }

  abstract execute(interaction: UserContextMenuCommandInteraction): Promise<any>;
}