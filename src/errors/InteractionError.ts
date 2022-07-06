import { Client, codeBlock, CommandInteractionOptionResolver, ComponentType, EmbedBuilder, InteractionType, WebhookClient } from 'discord.js';
import { env } from 'node:process';

const { ERROR_WEBHOOK } = env;

export default class InteractionError {
  ERROR_WEBHOOK!: WebhookClient;

  constructor(public data: InteractionErrorData) { }

  async send(data = this.data) {
    if (!(ERROR_WEBHOOK && data.client.isReady()))
      return console.error(data.error);

    if (!this.ERROR_WEBHOOK)
      try {
        this.ERROR_WEBHOOK = new WebhookClient({ url: ERROR_WEBHOOK });
      } catch {
        return console.error(this.data.error);
      }

    const commandName = [
      data.commandName,
      data.options?.getSubcommandGroup(false),
      data.options?.getSubcommand(false),
    ].filter(a => a);

    const interactionType = [
      InteractionType[data.type],
      ComponentType[data.componentType],
    ].filter(a => a);

    try {
      await this.ERROR_WEBHOOK.send({
        avatarURL: data.client.user?.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(codeBlock('ts', `${data.error.stack}`.slice(0, 4087)))
            .setFields([{
              name: 'Command',
              value: codeBlock('properties', `${commandName.join(' > ')}`),
              inline: true,
            }, {
              name: 'Type',
              value: codeBlock('properties', `${interactionType.join(' > ')}`),
              inline: true,
            }])
            .setTitle(`${data.error.name}: ${data.error.message}`.slice(0, 256)),
        ],
        username: data.client.user?.username,
      });
    } catch {
      console.error(data.error);
    }
  }
}

interface InteractionErrorData {
  client: Client;
  commandName: string;
  componentType: ComponentType;
  error: Error;
  options?: CommandInteractionOptionResolver;
  type: InteractionType;
}