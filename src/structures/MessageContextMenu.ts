import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { MessageContextMenuInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default class MessageContextMenu extends Base {
  data!: ContextMenuCommandBuilder;

  constructor(client: Client) {
    super(client);
  }

  async execute(interaction: MessageContextMenuInteraction) { }
}