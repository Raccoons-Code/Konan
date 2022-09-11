import { ApplicationCommandType, Client, codeBlock, CommandInteractionOptionResolver, ComponentType, EmbedBuilder, InteractionType, WebhookClient } from 'discord.js';
import { env } from 'node:process';

export default class InteractionError {
  #ERROR_WEBHOOK!: WebhookClient;

  constructor() {
    try {
      this.#ERROR_WEBHOOK = new WebhookClient({ url: env.ERROR_WEBHOOK! });
    } catch {
      return console.error('Fail to initialize interaction error webhook logger.')!;
    }
  }

  async send(data: InteractionErrorData) {
    if (!(this.#ERROR_WEBHOOK && data.client.isReady()))
      return console.error(data.error);

    const commandName = [
      data.commandName,
      data.options?.getSubcommandGroup(false),
      data.options?.getSubcommand(false),
    ].filter(a => a);

    const interactionType = [
      InteractionType[data.type],
      ApplicationCommandType[data.commandType],
      ComponentType[data.componentType],
    ].filter(a => a);

    try {
      await this.#ERROR_WEBHOOK.send({
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
  commandType: ApplicationCommandType;
  componentType: ComponentType;
  error: Error;
  options?: CommandInteractionOptionResolver;
  type: InteractionType;
}