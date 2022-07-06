import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, Message, MessagePayload, WebhookEditMessageOptions } from 'discord.js';
import assert from 'node:assert';
import Ping from '../../../commands/slash_interaction/Ping';

const command = new Ping();

const now = Date.now();

const interaction = new class Interaction {
  client = {
    ws: {
      ping: 100,
    },
  };
  createdTimestamp = now;
  editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message<boolean>> {
    return new Promise(resolve => resolve(<any>options));
  }
  reply(options: InteractionReplyOptions & { fetchReply: true; }): Promise<Message<boolean>> {
    options;
    return new Promise(resolve => resolve(<Message<boolean>>{
      createdTimestamp: now + 100,
    }));
  }
} as ChatInputCommandInteraction<'cached'>;

const expected = {
  embeds: [
    new EmbedBuilder()
      .setFields([
        { name: ':signal_strength:', value: `**\`${100}\`ms**`, inline: true },
        { name: ':robot:', value: `**\`${100}\`ms**`, inline: true },
      ]),
  ],
};

command.execute(interaction).then(pong => {
  const resolved = pong.embeds[0].toJSON();

  expected.embeds[0].setColor(resolved.color!);

  assert.deepStrictEqual(resolved, expected.embeds[0].toJSON());
});