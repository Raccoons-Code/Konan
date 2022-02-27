const { SlashCommand } = require('../../structures');
const { capitalize, mathRandom } = require('../../util');
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
  constructor(client) {
    super(client, {
      clientPermissions: ['ATTACH_FILES'],
    });
    this.data = this.setName('random')
      .setDescription('Replies with random imagens.')
      .addStringOption(option => option.setName('type')
        .setDescription('Type')
        .setChoices(Choices.getChoices()));
  }

  async execute(interaction = this.CommandInteraction) {
    const { channel, client, locale, options } = interaction;

    const clientPermissions = channel.permissionsFor(client.user.id).missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return await interaction.reply({
        content: this.t('missingChannelPermission', { locale, PERMISSIONS: clientPermissions }),
        ephemeral: true,
      });

    await interaction.deferReply();

    const string = options.getString('type');

    await this[`execute${string || Choices.getRandom()}`](interaction);
  }

  async executecat(interaction = this.CommandInteraction) {
    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    interaction.editReply({ files: [file] });
  }
};