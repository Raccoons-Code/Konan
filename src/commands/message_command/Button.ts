import { Message, MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { Client, Command } from '../../structures';

export default class extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'button',
      description: 'Makes a link button.',
      aliases: ['http', 'https'],
      clientPermissions: ['MANAGE_WEBHOOKS'],
    });
  }

  async execute(message: Message) {
    message.delete().catch(() => null);

    const { author, channel, client, member, text } = message;

    const matchedComponentLink = text.match(this.pattern.componentLinkG) ?? [];

    const componentLinks = matchedComponentLink.map(c => {
      const [, emoji, label, component, url] = c.match(this.pattern.componentLink) ?? [];

      return this.Util.ComponentLink[<'button'>component]?.({ emoji, label, url });
    })
      .filter(v => typeof v !== 'undefined');

    const content = matchedComponentLink.reduce((acc, c) => {
      if (/\]\((button):/.test(c))
        return `${acc.split(c).join(' ')}`;

      return `${acc}`;
    }, text);

    const components = this.getButtons(componentLinks);

    const avatarURL = member?.displayAvatarURL({ dynamic: true }) ?? author.displayAvatarURL({ dynamic: true });

    const username = member?.displayName ?? author.username;

    const webhook = await (<TextChannel>channel).fetchWebhooks()
      .then(w => w.find(v => v.name === client.user?.id)) ??
      await (<TextChannel>channel).createWebhook(client.user!.id);

    await webhook.send({ avatarURL, components, content, username });
  }

  getButtons(buttons: MessageButton[], rows: MessageActionRow[] = []): MessageActionRow[] {
    for (let i = 0; i < buttons.length; i += 5) {
      const mButtons = buttons.slice(i, i + 5);

      rows.push(new MessageActionRow()
        .setComponents(mButtons));
    }

    return rows;
  }
}