import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { UserContextMenuInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default abstract class UserContextMenu extends Base {
  data!: ContextMenuCommandBuilder;

  constructor(client: Client) {
    super(client);
  }

  abstract execute(interaction: UserContextMenuInteraction): Promise<any>;
}