import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import BaseCommand from './BaseCommand';

export default abstract class UserContextMenu extends BaseCommand {
  data!: ContextMenuCommandBuilder;

  constructor() {
    super();
  }

  abstract execute(interaction: UserContextMenuCommandInteraction): Promise<any>;
}