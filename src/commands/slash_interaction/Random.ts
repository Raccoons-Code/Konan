import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { CommandInteraction, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';
import { capitalize, mathRandom } from '../../util';

const Choices = new class {
  choices: string[];
  _choices!: [name: string, value: string][];

  constructor() {
    this.choices = ['cat'];

    this.setChoices();
  }

  getChoices() {
    return this._choices ?? this.setChoices();
  }

  getRandom() {
    return this.choices.sort(() => mathRandom(3, -1))[mathRandom(this.choices.length, 0)];
  }

  setChoices(array: [name: string, value: string][] = []) {
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];

      array[i] = [capitalize(choice), choice];
    }

    return this._choices = array;
  }
};

export default class Random extends SlashCommand {
  [k: string]: any

  constructor(client: Client) {
    super(client, {
      clientPermissions: ['ATTACH_FILES'],
    });

    this.data = new SlashCommandBuilder().setName('random')
      .setDescription('Replies with random imagens.')
      .addStringOption(option => option.setName('type')
        .setDescription('Type')
        .setChoices(Choices.getChoices()));
  }

  async execute(interaction: CommandInteraction) {
    const { channel, client, locale, options } = <CommandInteraction<'cached'>>interaction;

    const clientPermissions = channel?.permissionsFor(<string>client.user?.id)
      ?.missing(this.props?.clientPermissions as PermissionString[]) ?? [];

    if (clientPermissions.length)
      return await interaction.reply({
        content: this.t('missingChannelPermission', { locale, PERMISSIONS: clientPermissions }),
        ephemeral: true,
      });

    await interaction.deferReply();

    const string = options.getString('type');

    await this[`execute${string ?? Choices.getRandom()}`]?.(interaction);
  }

  async executecat(interaction: CommandInteraction) {
    const { file } = await axios.get('https://aws.random.cat/meow').then(r => r.data);

    await interaction.editReply({ files: [file] });
  }
}