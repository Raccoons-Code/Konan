import { translate } from '@vitalets/google-translate-api';
import { ApplicationCommandType, codeBlock, EmbedBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import { MessageContextMenu } from '../../structures';
import { googleTranslateApiLanguages } from '../../util/Constants';

const langs = Object.keys(googleTranslateApiLanguages)
  .filter(l => !/(isSupported|getCode)/.test(l));

export default class Translate extends MessageContextMenu {
  constructor() {
    super();

    this.data.setName('Translate');
  }

  build() {
    return this.data
      .setType(ApplicationCommandType.Message)
      .setNameLocalizations(this.getLocalizations('translateName'));
  }

  async execute(interaction: MessageContextMenuCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale, targetMessage } = interaction;

    const to = langs.find(l => RegExp(l, 'i').test(locale));

    const translation = await translate(targetMessage.content, { from: 'auto', to });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${codeBlock(translation.text.slice(0, 4089))}`)
          .setTitle([
            'Translation',
            'to', googleTranslateApiLanguages[<'auto'>to],
          ].join(' ')),
      ],
    });
  }
}