const { SlashCommand } = require('../../classes');
const { capitalize, mathRandom } = require('../../methods');
const fetch = require('node-fetch');

const Choices = new class {
  constructor() {
    this.choices = ['cat'];
  }

  getChoices() {
    return this._choices || this.setChoices();
  }

  getRandom() {
    return this.choices.sort(() => mathRandom(3, -1))[mathRandom(this.choices.length, 0)];
  }

  setChoices(array = []) {
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];

      array[i] = [capitalize(choice), choice];
    }
    return this._choices = array;
  }
};

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('random')
      .setDescription('Replies with random imagens.')
      .addStringOption(option => option.setName('type')
        .setDescription('Type')
        .setChoices(Choices.getChoices()));
  }

  async execute(interaction = this.CommandInteraction) {
    const { channel, client, locale, options } = interaction;

    const missingPermissions = channel.permissionsFor(client.user.id).missing(['ATTACH_FILES']);

    if (missingPermissions.length)
      return interaction.reply({
        content: this.t('missingChannelPermission', { locale, permissions: missingPermissions }),
        ephemeral: true,
      });

    await interaction.deferReply();

    const string = options.getString('type');

    this[`execute${string || Choices.getRandom()}`](interaction);
  }

  async executecat(interaction = this.CommandInteraction) {
    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    interaction.editReply({ files: [file] });
  }
};