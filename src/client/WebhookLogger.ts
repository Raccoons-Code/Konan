import { codeBlock, EmbedBuilder, Guild, inlineCode, time, userMention, WebhookClient } from 'discord.js';
import { env } from 'node:process';

const inline = true;

class WebhookLogger {
  #WEBHOOK_LOGGER!: WebhookClient;

  get WEBHOOK_LOGGER() {
    if (!env.LOGGER_WEBHOOK) return;

    if (!this.#WEBHOOK_LOGGER)
      try {
        this.#WEBHOOK_LOGGER = new WebhookClient({ url: env.LOGGER_WEBHOOK });
      } catch {
        return console.error('Fail to initialize webhook logger.');
      }

    return this.#WEBHOOK_LOGGER;
  }

  async newGuild(guild: Guild) {
    if (!this.WEBHOOK_LOGGER) return;

    const invites = await guild.invites.fetch();
    const invite = invites.find(i => !i.temporary);

    await this.WEBHOOK_LOGGER.send({
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
    if (!this.WEBHOOK_LOGGER) return;

    await this.WEBHOOK_LOGGER.send({
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

const webhookLogger = new WebhookLogger();

export default webhookLogger;