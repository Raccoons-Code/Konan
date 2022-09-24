import { stripIndents } from 'common-tags';
import { ApplicationCommandType, Client, codeBlock, CommandInteractionOptionResolver, ComponentType, EmbedBuilder, Guild, inlineCode, InteractionType, time, userMention, WebhookClient } from 'discord.js';
import { totalmem } from 'node:os';
import { env, memoryUsage } from 'node:process';
import Util from '../util';

const codeBlockLength = codeBlock('ts').length;
const inline = true;

class WebhookLogger {
  #ERROR_WEBHOOK!: WebhookClient;
  #LOGGER_WEBHOOK!: WebhookClient;
  #STATS_WEBHOOK!: WebhookClient;

  constructor() {
    try {
      this.#ERROR_WEBHOOK = new WebhookClient({ url: env.ERROR_WEBHOOK! });
    } catch {
      return console.error('Fail to initialize error webhook logger.')!;
    }
    try {
      this.#LOGGER_WEBHOOK = new WebhookClient({ url: env.LOGGER_WEBHOOK! });
    } catch {
      return console.error('Fail to initialize webhook logger.')!;
    }
    try {
      this.#STATS_WEBHOOK = new WebhookClient({ url: env.STATS_WEBHOOK! });
    } catch {
      return console.error('Fail to initialize stats webhook logger.')!;
    }
  }

  async commonError(data: CommonErrorData) {
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
      });
    } catch {
      console.error(data.error);
    }
  }

  async interactionError(data: InteractionErrorData) {
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

  async OSStats(data: StatsLoggerData) {
    if (!this.#STATS_WEBHOOK) return;

    const { heapUsed } = memoryUsage();

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

    const stats = stripIndents(`
      RAM     : ${new Util.Bytes(heapUsed)} / ${new Util.Bytes(totalmem())}
    `);

    this.#STATS_WEBHOOK.send({
      avatarURL: data.client?.user?.displayAvatarURL(),
      embeds: [
        new EmbedBuilder()
          .setFields([
            { name: 'Stats', value: codeBlock('properties', stats) }, {
              name: 'Command',
              value: codeBlock('properties', `${commandName.join(' > ')}`),
              inline: true,
            }, {
              name: 'Type',
              value: codeBlock('properties', `${interactionType.join(' > ')}`),
              inline: true,
            },
          ]),
      ],
      username: data.client?.user?.username,
    });
  }

  async newGuild(guild: Guild) {
    if (!this.#LOGGER_WEBHOOK) return;

    const invites = await guild.invites.fetch();
    const invite = invites.find(i => !i.temporary);

    await this.#LOGGER_WEBHOOK.send({
      avatarURL: guild.client.user?.displayAvatarURL(),
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: guild.name, url: invite?.url, iconURL: guild.iconURL() ?? undefined })
          .setColor('Green')
          .setDescription(guild.description)
          .setFields(
            { name: 'ID', value: codeBlock(guild.id), inline },
            { name: 'Owner', value: userMention(guild.ownerId), inline },
            { name: 'Preferred locale', value: inlineCode(guild.preferredLocale), inline },
            { name: 'Member count', value: `${guild.memberCount}`, inline },
            { name: 'Channel count', value: `${guild.channels.cache.size}`, inline },
            { name: 'Emoji count', value: `${guild.emojis.cache.size}`, inline },
            { name: 'Server created at', value: `${time(guild.createdAt)}${time(guild.createdAt, 'R')}`, inline },
          )
          .setImage(guild.bannerURL({ size: 512 }))
          .setThumbnail(guild.discoverySplashURL({ size: 512 }))
          .setTimestamp(guild.joinedAt)
          .setTitle('YEAH! I joined a new server!'),
      ],
      username: guild.client.user?.username,
    });
  }

  async oldGuild(guild: Guild) {
    if (!this.#LOGGER_WEBHOOK) return;

    await this.#LOGGER_WEBHOOK.send({
      avatarURL: guild.client.user?.displayAvatarURL(),
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined })
          .setColor('DarkRed')
          .setFields(
            { name: 'ID', value: codeBlock(guild.id), inline },
            { name: 'Joined at', value: `${time(guild.joinedAt)}${time(guild.joinedAt, 'R')}`, inline },
            { name: 'Server created at', value: `${time(guild.createdAt)}${time(guild.createdAt, 'R')}`, inline },
          )
          .setImage(guild.bannerURL({ size: 512 }))
          .setThumbnail(guild.discoverySplashURL({ size: 512 }))
          .setTimestamp(Date.now())
          .setTitle('Oh! no! I left a server.'),
      ],
      username: guild.client.user?.username,
    });
  }
}

export default WebhookLogger;

interface CommonErrorData {
  client?: Client;
  error: Error;
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

interface StatsLoggerData {
  client: Client;
  commandName: string;
  commandType: ApplicationCommandType;
  componentType: ComponentType;
  options?: CommandInteractionOptionResolver;
  type: InteractionType;
}