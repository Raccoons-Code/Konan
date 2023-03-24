import { APIWebhook, ApplicationCommandType, chatInputApplicationCommandMention, codeBlock, Colors, ComponentType, EmbedBuilder, Guild, inlineCode, Interaction, InteractionType, Routes, time, userMention, WebhookClient } from "discord.js";
import client from ".";
import { BaseComponentCustomId } from "../@types";
import { contentWithCodeBlockLength, JSONparse } from "../util/utils";

const inline = true;

export default class WebhookLogger {
  #ERROR_WEBHOOK!: WebhookClient;
  #LOG_WEBHOOK!: WebhookClient;

  constructor() { }

  get ERROR_WEBHOOK() {
    return this.#ERROR_WEBHOOK;
  }

  set ERROR_WEBHOOK(value) {
    this.#ERROR_WEBHOOK ??= value;
  }

  get LOG_WEBHOOK() {
    return this.#LOG_WEBHOOK;
  }

  set LOG_WEBHOOK(value) {
    this.#LOG_WEBHOOK ??= value;
  }

  async create(channelId: string) {
    return client.rest.post(Routes.channelWebhooks(channelId), {
      body: {
        name: `${client.user?.tag} ${client.user?.id}`,
        avatar: undefined,
      },
    }) as Promise<APIWebhook>;
  }

  async find(channelId: string) {
    const webhooks = await client.rest.get(Routes.channelWebhooks(channelId))
      .catch(() => null) as APIWebhook[];

    if (!webhooks?.length) return;

    return webhooks.find(webhook => webhook.application_id === client.user?.id);
  }

  async findOrCreate(channelId: string) {
    const webhook = await this.find(channelId)
      .then(wh => wh ?? this.create(channelId));

    return new WebhookClient(webhook.token ? {
      id: webhook.id,
      token: webhook.token,
    } : {
      url: webhook.url!,
    });
  }

  async commonError(error: Error) {
    if (!this.ERROR_WEBHOOK) return console.error(error);

    try {
      await this.ERROR_WEBHOOK.send({
        avatarURL: client.user?.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(codeBlock("ts", `${error.stack}`
              .slice(0, contentWithCodeBlockLength("ts"))))
            .setTitle(`${error.name}: ${error.message}`.slice(0, 256)),
        ],
        username: client.user?.username,
      });
    } catch {
      console.error(error);
    }
  }

  async interactionError(interaction: Interaction, error: Error) {
    if (!this.ERROR_WEBHOOK) return console.error(error);

    const commandName = [] as unknown as [string, string, string, string];

    if ("commandName" in interaction) {
      commandName.push(interaction.commandName);

      if ("getSubcommandGroup" in interaction.options) {
        const subCommandGroup = interaction.options.getSubcommandGroup(false);

        if (subCommandGroup) {
          commandName.push(subCommandGroup);
        }
      }

      if ("getSubcommand" in interaction.options) {
        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand) {
          commandName.push(subCommand);
        }
      }

      commandName.push(interaction.commandId);
    }

    if ("customId" in interaction) {
      const parsedId = JSONparse<BaseComponentCustomId>(interaction.customId);

      if (parsedId) {
        commandName.push(parsedId.c);

        if (parsedId.sc) {
          commandName.push(parsedId.sc);
        }

        if (parsedId.scg) {
          commandName.push(parsedId.scg);
        }
      }
    }

    const interactionType = [InteractionType[interaction.type]];

    if ("commandType" in interaction) {
      interactionType.push(ApplicationCommandType[interaction.commandType]);
    }

    if ("componentType" in interaction) {
      interactionType.push(ComponentType[interaction.componentType]);
    }

    try {
      await this.ERROR_WEBHOOK.send({
        avatarURL: client.user?.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(codeBlock("ts", `${error.stack}`
              .slice(0, contentWithCodeBlockLength("ts"))))
            .setFields([{
              name: "Author",
              value: `${interaction.user}`
                + ` ${inlineCode(interaction.user.tag)}`
                + ` ${inlineCode(interaction.user.id)}`,
            }, {
              name: "Command",
              value: "commandName" in interaction ?
                chatInputApplicationCommandMention(...commandName) :
                codeBlock("c", commandName.filter(c => c).join(" > ")),
            }, {
              name: "Type",
              value: codeBlock("c", interactionType.filter(i => i).join(" > ")),
            }])
            .setTitle(`${error.name}: ${error.message}`.slice(0, 256))
            .setFooter("code" in error ? { text: `Error code: ${error.code}` } : null),
        ],
        username: client.user?.username,
      });
    } catch {
      console.error(error);
    }
  }

  async newGuild(guild: Guild) {
    if (!this.LOG_WEBHOOK) return;

    const invites = await guild.invites.fetch().catch(() => null);
    const invite = invites?.find(i => {
      if (i.temporary) return false;
      if (i.maxUses) return false;
      if (i.targetApplication) return false;
      if (i.targetType) return false;
      if (i.targetUser) return false;
      return true;
    });

    try {
      await this.LOG_WEBHOOK.send({
        avatarURL: client.user?.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: guild.name, url: invite?.url, iconURL: guild.iconURL() ?? undefined })
            .setColor(Colors.Green)
            .setDescription(guild.description)
            .setFields(
              { name: "ID", value: codeBlock(guild.id), inline },
              { name: "Owner", value: userMention(guild.ownerId), inline },
              { name: "Preferred locale", value: inlineCode(guild.preferredLocale), inline },
              { name: "Member count", value: `${guild.memberCount}`, inline },
              { name: "Channel count", value: `${guild.channels.cache.size}`, inline },
              { name: "Emoji count", value: `${guild.emojis.cache.size}`, inline },
              { name: "Server created at", value: `${time(guild.createdAt)} ${time(guild.createdAt, "R")}`, inline },
            )
            .setImage(guild.bannerURL({ size: 512 }))
            .setThumbnail(guild.discoverySplashURL({ size: 512 }))
            .setTimestamp(guild.joinedAt)
            .setTitle("YEAH! I joined a new server!"),
        ],
        username: client.user?.username,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async oldGuild(guild: Guild) {
    if (!this.LOG_WEBHOOK) return;

    try {
      await this.LOG_WEBHOOK.send({
        avatarURL: client.user?.displayAvatarURL(),
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined })
            .setColor(Colors.DarkRed)
            .setFields(
              { name: "ID", value: codeBlock(guild.id), inline },
              { name: "Joined at", value: `${time(guild.joinedAt)} ${time(guild.joinedAt, "R")}`, inline },
              { name: "Server created at", value: `${time(guild.createdAt)} ${time(guild.createdAt, "R")}`, inline },
              { name: "Member count", value: `${guild.memberCount}`, inline },
              { name: "Channel count", value: `${guild.channels.cache.size}`, inline },
              { name: "Emoji count", value: `${guild.emojis.cache.size}`, inline },
            )
            .setImage(guild.bannerURL({ size: 512 }))
            .setThumbnail(guild.discoverySplashURL({ size: 512 }))
            .setTitle("Oh! no! I left a server."),
        ],
        username: client.user?.username,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
