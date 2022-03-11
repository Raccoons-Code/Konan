const { SelectMenuInteraction } = require('../../structures');
const { codeBlock, inlineCode, time, userMention } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { env } = process;
const { DONATE_LINK, GUILD_INVITE } = env;
const resetProps = { attachments: [], components: [], content: null, embeds: [], files: [] };

module.exports = class extends SelectMenuInteraction {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Help menu',
    });
  }

  async execute(interaction = this.SelectMenuInteraction) {
    const { values } = interaction;

    this[values[0]]?.(interaction);
  }

  async home(interaction = this.SelectMenuInteraction) {
    const { client, guild, locale, user } = interaction;

    const avatarURL = guild?.me.displayAvatarURL({ dynamic: true }) ||
      client.user.displayAvatarURL({ dynamic: true });

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setDescription(this.t('helpText', { locale, user }))
      .setThumbnail(avatarURL)
      .setTitle(this.t('konanSupport', { locale }))];

    const buttons = [new MessageButton()
      .setEmoji('📮') // :postbox:
      .setLabel(this.t('inviteLink', { locale }))
      .setStyle('LINK')
      .setURL(client.invite)];

    if (GUILD_INVITE)
      buttons.push(new MessageButton()
        .setEmoji('🪤') // :mouse_trap:
        .setLabel(this.t('supportServer', { locale }))
        .setStyle('LINK')
        .setURL(`${client.options.http.invite}/${GUILD_INVITE}`));

    if (DONATE_LINK)
      buttons.push(new MessageButton()
        .setEmoji('💸') // :money_with_wings:
        .setLabel(this.t('donate', { locale }))
        .setStyle('LINK')
        .setURL(`${DONATE_LINK}`));

    const menus = [this.setSelectMenu(0)];

    const components = [new MessageActionRow().setComponents(buttons),
      new MessageActionRow().setComponents(menus)];

    await interaction.update({ components, embeds });
  }

  async commands(interaction = this.SelectMenuInteraction) {
    const { client, locale } = interaction;

    const { slash_interaction } = client.commands;

    const filtered = slash_interaction.filter(c => c.defaultPermission !== false);

    const slashcommands = filtered.toJSON();

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setDescription(this.convertCommandsToString(slashcommands).match(this.regexp.content)[1])
      .setFooter({ text: `Total: ${slashcommands.length}` })
      .setTitle(this.t('konanSupport', { locale }))];

    const menus = [this.setSelectMenu(1)];

    const components = [new MessageActionRow().setComponents(menus)];

    await interaction.update({ components, embeds });
  }

  async localization(interaction = this.SelectMenuInteraction) {
    const { locale } = interaction;

    const embeds = [new MessageEmbed().setColor('RANDOM')
      .setImage('https://badges.awesome-crowdin.com/translation-15144556-499220.png')
      .setTitle(this.t('konanSupport', { locale }))];

    const menus = [this.setSelectMenu(2)];

    const components = [new MessageActionRow().setComponents(menus)];

    await interaction.update({ components, embeds });
  }

  /**
   * @param {Array} commands
   * @param {string} [text='']
   */
  convertCommandsToString(commands, text = '') {
    for (let i = 0; i < commands.length; i++) {
      const { description, name } = commands[i];

      text = `${text}/${name} - ${description}\n`;
    }

    return `\`\`\`properties\n${text}\`\`\``;
  }

  setSelectMenu(i = 0) {
    const earth = ['🌍', '🌎', '🌏'][this.util.mathRandom(2, 0)]; // :earth_africa: :earth_americas: :earth_asia:

    return new MessageSelectMenu()
      .setCustomId(JSON.stringify({ c: this.data.name }))
      .setOptions([
        { label: '🏠 Home', value: 'home', default: i === 0 }, // :home:
        { label: '🗃️ Commands', value: 'commands', default: i === 1 }, // :card_box:
        /* { label: `${earth} Languages`, value: 'localization', default: i === 0 }, */
      ]);
  }
};