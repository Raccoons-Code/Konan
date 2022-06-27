import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default abstract class UserContextMenu extends Base {
  data!: ContextMenuCommandBuilder;

  constructor(client: Client) {
    super(client);
  }

  abstract execute(interaction: UserContextMenuCommandInteraction): Promise<any>;
}