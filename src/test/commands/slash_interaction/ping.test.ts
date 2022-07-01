import { ChatInputCommandInteraction, Client, InteractionReplyOptions, Message, MessagePayload, WebhookEditMessageOptions } from 'discord.js';
import assert from 'node:assert';
import Ping from '../../../commands/slash_interaction/Ping';

const ping = new Ping(<Client>{});

const interaction = new class Interaction {
  client = {
    ws: {
      ping: 100,
    },
  };
  createdTimestamp = Date.now();
  editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message<boolean>> {
    options;
    return new Promise(resolve => resolve(<Message<boolean>>{ content: 'true' }));
  }
  reply(options: InteractionReplyOptions & { fetchReply: true; }): Promise<Message<boolean>> {
    options;
    return new Promise(resolve => resolve(<Message<boolean>>{
      createdTimestamp: Date.now(),
    }));
  }
} as ChatInputCommandInteraction<'cached'>;

ping.execute(interaction).then(pong => assert.equal(pong.content, 'true'));