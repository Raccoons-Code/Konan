import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { UserContextMenuInteraction } from 'discord.js';
import Base from './Base';
import Client from './Client';

export default class UserContextMenu extends Base {
  data!: ContextMenuCommandBuilder;

  constructor(client: Client) {
    super(client);
  }

  public async execute(interaction: UserContextMenuInteraction) { }
}