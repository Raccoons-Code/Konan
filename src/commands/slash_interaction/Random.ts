import axios from 'axios';
import { APIApplicationCommandOptionChoice, ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';
import Util from '../../util';

const Choices = new class {
  choices: string[];
  _choices!: APIApplicationCommandOptionChoice<string>[];

  constructor() {
    this.choices = ['Cat'];

    this.setChoices();
  }

  getChoices() {
    return this._choices ?? this.setChoices();
  }

  getRandom() {
    return this.choices.sort(() => Util.mathRandom(3, -1))[Util.mathRandom(this.choices.length, 0)];
  }

  setChoices(array: APIApplicationCommandOptionChoice<string>[] = []) {
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];

      array[i] = {
        name: Util.capitalize(choice),
        value: choice,
        name_localizations: Util.getLocalizations(choice),
      };
    }

    return this._choices = array;
  }
};

export default class Random extends SlashCommand {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      category: 'Fun',
      clientPermissions: ['AttachFiles'],
    });

    this.data = new SlashCommandBuilder().setName('random')
      .setDescription('Replies with random images.')
      .setNameLocalizations(this.getLocalizations('randomName'))
      .setDescriptionLocalizations(this.getLocalizations('randomDescription'))
      .addStringOption(option => option.setName('type')
        .setDescription('Select the type of the random image.')
        .setNameLocalizations(this.getLocalizations('randomTypeName'))
        .setDescriptionLocalizations(this.getLocalizations('randomTypeDescription'))
        .setChoices(...Choices.getChoices()));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const { channel, client, locale, options } = <ChatInputCommandInteraction<'cached'>>interaction;

    const clientPerms = channel?.permissionsFor(client.user!)?.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.reply({
        content: this.t('missingChannelPermission', {
          locale,
          permission: this.t(clientPerms[0], { locale }),
        }),
        ephemeral: true,
      });

    await interaction.deferReply();

    const string = options.getString('type');

    return this[`execute${string ?? Choices.getRandom()}`]?.(interaction);
  }

  async executeCat(interaction: ChatInputCommandInteraction): Promise<any> {
    const { file } = await axios.get('https://aws.random.cat/meow').then(r => r.data);

    return interaction.editReply({ files: [file] });
  }
}