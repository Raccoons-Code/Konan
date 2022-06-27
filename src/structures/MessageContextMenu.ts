import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default abstract class MessageContextMenu extends Base {
  data!: ContextMenuCommandBuilder;

  constructor(client: Client) {
    super(client);
  }

  abstract execute(interaction: MessageContextMenuCommandInteraction): Promise<any>;
}