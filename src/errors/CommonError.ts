import { Client, codeBlock, EmbedBuilder, MessageFlags, WebhookClient } from 'discord.js';
import { env } from 'node:process';

const codeBlockLength = codeBlock('ts').length;

export default class CommonError {
  #ERROR_WEBHOOK!: WebhookClient;

  constructor() {
    try {
      this.#ERROR_WEBHOOK = new WebhookClient({ url: env.ERROR_WEBHOOK! });
    } catch {
      return console.error('Fail to initialize error webhook logger.')!;
    }
  }

  async send(data: CommonErrorData) {
    if (!this.#ERROR_WEBHOOK || data.client?.isReady())
      return console.error(data.error);

    const embeds = [
      new EmbedBuilder()
        .setColor('Red')
        .setDescription(codeBlock('ts', `${data.error.stack}`.slice(0, 4096 - codeBlockLength)))
        .setTitle(`${data.error.name}: ${data.error.message}`.slice(0, 256)),
    ];

    if (data.error.cause)
      embeds[0].addFields({
        name: 'Cause',
        value: codeBlock('ts', `${data.error.cause}`.slice(0, 1024 - codeBlockLength)),
      });

    try {
      await this.#ERROR_WEBHOOK.send({
        avatarURL: data.client?.user?.displayAvatarURL(),
        embeds,
        username: data.client?.user?.username,
        flags: MessageFlags.Urgent,
      });
    } catch {
      console.error(data.error);
    }
  }
}

interface CommonErrorData {
  client?: Client;
  error: Error;
}