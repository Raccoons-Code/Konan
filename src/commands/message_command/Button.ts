import { ActionRowBuilder, ButtonBuilder, Message } from 'discord.js';
import { Command } from '../../structures';

export default class Button extends Command {
  constructor() {
    super({
      name: 'button',
      description: 'Makes a link button.',
      aliases: ['http', 'https'],
      appPermissions: ['ManageWebhooks'],
    });
  }

  async execute(message: Message): Promise<any> {
    message.delete().catch(() => null);

    const { author, channel, client, member, text } = message;

    const matchedComponentLink = text.match(this.regexp.componentLinkG) ?? [];

    const componentLinks = matchedComponentLink.map(c => {
      const [, emoji, label, component, url] = c.match(this.regexp.componentLink) ?? [];

      return this.Util.ComponentLink[<'button'>component]?.({ emoji, label, url });
    })
      .filter(v => typeof v !== 'undefined');

    const content = matchedComponentLink.reduce((acc, c) => {
      if (/\]\((button):/.test(c))
        return `${acc.split(c).join(' ')}`;

      return `${acc}`;
    }, text);

    const components = this.getButtons(componentLinks);

    const avatarURL = member?.displayAvatarURL() ?? author.displayAvatarURL();

    const username = member?.displayName ?? author.username;

    if (!('fetchWebhooks' in channel)) return;

    const webhook = await channel.fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await channel.createWebhook({
        name: `${client.user?.id}`,
      });

    return webhook.send({ avatarURL, components, content, username });
  }

  getButtons(buttons: ButtonBuilder[], rows: ActionRowBuilder<ButtonBuilder>[] = []) {
    for (let i = 0; i < buttons.length; i += 5) {
      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .setComponents(buttons.slice(i, i + 5)));
    }

    return rows;
  }
}