import { stripIndents } from "common-tags";
import { ActionRowBuilder, BaseManager, BitField, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, codeBlock, EmbedBuilder, GatewayIntentBits, inlineCode, OAuth2Scopes, PermissionFlagsBits, time, userMention } from "discord.js";
import ms from "ms";
import { memoryUsage, versions } from "node:process";
import { Stats } from "../../../@types";
import client, { appStats } from "../../../client";
import commandHandler from "../../../handlers/CommandHandler";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import Bytes from "../../../util/Bytes";
import { getAllMembersPresenceStatus } from "../../../util/commands/utils";
import { CPU_CORES, CPU_MODEL, DJS_VERSION, OS_VERSION, TOTAL_RAM, VERSION } from "../../../util/constants";
import emojis from "../../../util/emojis";
import { fetchProcessResponse } from "../../../util/Process";
import { getLocalizations, makeTable } from "../../../util/utils";

const inline = true;

export default class extends ChatInputCommand {
  [x: string]: any;

  constructor() {
    super({
      category: "Utility",
    });

    this.data.setName("info")
      .setDescription("Show the info message.");
  }

  build() {
    this.data
      .setNameLocalizations(getLocalizations("infoName"))
      .setDescriptionLocalizations(getLocalizations("infoDescription"))
      .addSubcommand(subCommand => subCommand.setName("app")
        .setDescription("Show the bot info.")
        .setNameLocalizations(getLocalizations("infoAppName"))
        .setDescriptionLocalizations(getLocalizations("infoAppDescription")))
      .addSubcommand(subcommand => subcommand.setName("channel")
        .setDescription("Show the channel info.")
        .setNameLocalizations(getLocalizations("infoChannelName"))
        .setDescriptionLocalizations(getLocalizations("infoChannelDescription"))
        .addChannelOption(option => option.setName("channel")
          .setDescription("Select a channel to show the info for.")
          .setNameLocalizations(getLocalizations("infoChannelChannelName"))
          .setDescriptionLocalizations(getLocalizations("infoChannelChannelDescription"))))
      .addSubcommand(subcommand => subcommand.setName("role")
        .setDescription("Role info.")
        .setNameLocalizations(getLocalizations("infoRoleName"))
        .setDescriptionLocalizations(getLocalizations("infoRoleDescription"))
        .addRoleOption(option => option.setName("role")
          .setDescription("Select a role to show the info for.")
          .setNameLocalizations(getLocalizations("infoRoleRoleName"))
          .setDescriptionLocalizations(getLocalizations("infoRoleRoleDescription"))
          .setRequired(true)))
      .addSubcommand(subCommand => subCommand.setName("server")
        .setDescription("Show the server info.")
        .setNameLocalizations(getLocalizations("infoServerName"))
        .setDescriptionLocalizations(getLocalizations("infoServerDescription")))
      .addSubcommand(subCommand => subCommand.setName("user")
        .setDescription("Show the user info.")
        .setNameLocalizations(getLocalizations("infoUserName"))
        .setDescriptionLocalizations(getLocalizations("infoUserDescription"))
        .addUserOption(option => option.setName("user")
          .setDescription("Select a user to show the info for.")
          .setNameLocalizations(getLocalizations("infoUserUserName"))
          .setDescriptionLocalizations(getLocalizations("infoUserUserDescription"))));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    await this[subcommand]?.(interaction);

    return;
  }

  async app(interaction: ChatInputCommandInteraction) {
    const me = interaction.guild?.members.me;
    const user = client.user;

    const iconURL = me?.displayAvatarURL() ?? user?.displayAvatarURL();
    const username = me?.displayName ?? user?.username;

    const engine = stripIndents(`
      Node : ${versions.node}
    `);

    const library = stripIndents(`
      Discord.js : ${DJS_VERSION}
    `);

    const stats: [string, string | number][] = [
      ["Ping", `${client.ws.ping}ms`],
    ];

    const status = await fetchProcessResponse<Stats>({
      action: "stats",
    });

    if (client.shard) {
      stats.unshift(["Shard", `${appStats.shardId + 1}/${appStats.totalShards}`]);
    }

    if (appStats.workers) {
      stats.unshift(["Cluster", `${appStats.workerId}/${appStats.workers}`]);
    }

    if (VERSION)
      stats.push(["Version", VERSION]);

    const data = status.reduce((acc, cur) => {
      acc.channels += cur.data.channels;
      acc.emojis += cur.data.emojis;
      acc.guilds += cur.data.guilds;
      acc.interactions += cur.data.interactions;
      acc.messages += cur.data.messages;
      acc.users += cur.data.users;
      acc.memoryUsage.heapUsed += cur.data.memoryUsage.heapUsed;

      Object.keys(cur.data.usedCommands).reduce((acc2, key) => {
        if (acc2[key]) {
          acc2[key] += cur.data.usedCommands[key];
        } else {
          acc2[key] = cur.data.usedCommands[key];
        }

        return acc2;
      }, acc.usedCommands);

      return acc;
    }, <Stats>{
      channels: 0,
      emojis: 0,
      guilds: 0,
      interactions: 0,
      messages: 0,
      users: 0,
      memoryUsage: {
        heapUsed: 0,
      },
      usedCommands: {},
    });

    stats.unshift(
      ["Servers", appStats.guilds < data.guilds ?
        `${appStats.guilds}/${data.guilds}` :
        appStats.guilds],
      ["Channels", appStats.channels < data.channels ?
        `${appStats.channels}/${data.channels}` :
        appStats.channels],
      ["Users", appStats.users < data.users ?
        `${appStats.users}/${data.users}` :
        appStats.users],
      ["Emojis", appStats.emojis < data.emojis ?
        `${appStats.emojis}/${data.emojis}` :
        appStats.emojis],
      ["Messages", appStats.messages < data.messages ?
        `${appStats.messages}/${data.messages}` :
        appStats.messages],
      ["Interactions", appStats.interactions < data.interactions ?
        `${appStats.interactions}/${data.interactions}` :
        appStats.interactions],
    );

    const popularCommands: [string, string | number][] =
      Object.keys(data.usedCommands)
        .sort((a, b) => data.usedCommands[a] > data.usedCommands[b] ? -1 : 1)
        .reduce<[string, string | number][]>((acc, key) => {
          acc.push([key, appStats.usedCommands[key] < data.usedCommands[key] ?
            `${appStats.usedCommands[key]}/${data.usedCommands[key]}` :
            appStats.usedCommands[key]]);

          return acc;
        }, []).slice(0, 10);


    const machine = stripIndents(`
      CPU : ${CPU_MODEL} (${CPU_CORES} cores)
      OS  : ${OS_VERSION}
      RAM : ${new Bytes(memoryUsage().heapUsed)} / ${new Bytes(data.memoryUsage.heapUsed)} / ${new Bytes(TOTAL_RAM)}
    `);

    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .setComponents([
            new ButtonBuilder()
              .setCustomId(JSON.stringify({ c: "info", sc: "app" }))
              .setEmoji("🔄")
              .setStyle(ButtonStyle.Secondary),
          ]),
      ],
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: username!, iconURL })
          .setColor("Random")
          .setFields([
            { name: "Library", value: codeBlock("c", library), inline },
            { name: "Engine", value: codeBlock("c", engine), inline },
            { name: "Machine", value: codeBlock("c", machine) },
            { name: "Stats", value: codeBlock("c", makeTable(stats)), inline },
            { name: "Popular Commands", value: codeBlock("c", makeTable(popularCommands)), inline },
            { name: "Uptime", value: `${time(client.readyAt!)} ${time(client.readyAt!, "R")}` },
          ]),
      ],
    });

    return;
  }

  async channel(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      await this.replyOnlyOnServer(interaction);
      return 1;
    }

    const channel = interaction.options.getChannel("channel") ?? interaction.channel;

    if (!channel) {
      await interaction.editReply({ content: "Missing channel." });
      return 1;
    }

    await channel.fetch();

    const embeds = [
      new EmbedBuilder()
        .setColor("Random")
        .setTitle(channel.name),
    ];

    if ("bitrate" in channel) {
      embeds[0].addFields({
        name: t("bitrate", interaction.locale),
        value: `${channel.bitrate / 1000}kb's`,
        inline,
      });
    }

    if ("full" in channel) {
      embeds[0].addFields({
        name: t("full", interaction.locale),
        value: t(`${channel.full}`, interaction.locale),
        inline,
      });
    }

    if ("memberCount" in channel && typeof channel.memberCount === "number") {
      embeds[0].addFields({
        name: t("memberCount", interaction.locale),
        value: `${channel.memberCount}`,
        inline,
      });
    }

    if ("messageCount" in channel && typeof channel.messageCount === "number") {
      embeds[0].addFields({
        name: t("messageCount", interaction.locale),
        value: `${channel.messageCount}`,
        inline,
      });
    }

    if ("nsfw" in channel) {
      embeds[0].addFields({
        name: "NSFW",
        value: t(`${channel.nsfw}`, interaction.locale),
        inline,
      });
    }

    if ("parent" in channel && channel.parent) {
      embeds[0].addFields({
        name: t("category", interaction.locale),
        value: `${channel.parent}`,
        inline,
      });
    }

    if ("rateLimitPerUser" in channel && typeof channel.rateLimitPerUser === "number") {
      embeds[0].addFields({
        name: t("slowmode", interaction.locale),
        value: ms(channel.rateLimitPerUser * 1000),
        inline,
      });
    }

    if ("rtcRegion" in channel) {
      embeds[0].addFields({
        name: t("rtcRegion", interaction.locale),
        value: channel.rtcRegion ?? t("automatic", interaction.locale),
        inline,
      });
    }

    if ("topic" in channel && typeof channel.topic === "string") {
      embeds[0].addFields({
        name: t("topic", interaction.locale),
        value: channel.topic,
        inline,
      });
    }

    if ("type" in channel) {
      const ct = `${ChannelType[channel.type]}`.match(/([A-Z]{1,}[a-z]*)+/)?.[1];

      embeds[0].addFields({
        name: t("type", interaction.locale),
        value: t(`${ct}`, interaction.locale),
        inline,
      });
    }

    if ("userLimit" in channel) {
      embeds[0].addFields({
        name: t("userLimit", interaction.locale),
        value: `${channel.userLimit || ":infinity:"}`,
        inline,
      });
    }

    if ("flags" in channel) {
      const arrayFlags = channel.flags.toArray();
      const textFlags = arrayFlags.join(" ").trim() || "-";

      embeds[0].addFields({ name: t("flags", interaction.locale), value: textFlags });
    }

    if ("children" in channel && channel.children instanceof BaseManager) {
      const arrayChildren = channel.children.cache.toJSON();
      const textChildren = arrayChildren.join(" ").trim() || "-";

      embeds[0].addFields({
        name: `${t("channels", interaction.locale)} [${arrayChildren.length}]`,
        value: textChildren,
      });
    }

    if ("threads" in channel && channel.threads instanceof BaseManager) {
      const arrayThreads = channel.threads.cache.toJSON();
      const textThreads = arrayThreads.join(" ").trim() || "-";

      embeds[0].addFields({
        name: `${t("threads", interaction.locale)} [${arrayThreads.length}]`,
        value: textThreads,
      });
    }

    if ("createdAt" in channel && channel.createdAt) {
      embeds[0].addFields({
        name: t("creationDate", interaction.locale),
        value: `${time(channel.createdAt)} ${time(channel.createdAt, "R")}`,
      });
    }

    await interaction.editReply({ embeds });

    return;
  }

  async role(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      this.replyOnlyOnServer(interaction);
      return 1;
    }

    const role = interaction.options.getRole("role", true);

    const arrayPerms = role.permissions.toArray();
    const textPerms = arrayPerms.map(p => t(p, interaction.locale)).join(", ") || "-";

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(role.color || "Random")
          .setAuthor({ name: role.name, iconURL: role.iconURL() ?? undefined })
          .setFields([
            { name: t("mentionable", interaction.locale), value: t(`${role.mentionable}`, interaction.locale), inline },
            { name: t("members", interaction.locale), value: `${role.members.size}`, inline },
            { name: `${t("permissions", interaction.locale)} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
            { name: "Bot role", value: t(`${Boolean(role.tags?.botId)}`, interaction.locale), inline },
            { name: "Integration role", value: t(`${Boolean(role.tags?.integrationId)}`, interaction.locale), inline },
            { name: "Subscriber role", value: t(`${Boolean(role.tags?.premiumSubscriberRole)}`, interaction.locale), inline },
          ]),
      ],
    });

    return;
  }

  async server(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      await this.replyOnlyOnServer(interaction);
      return 1;
    }

    await interaction.guild.fetch();
    await interaction.guild.members.fetch({ time: 1000 }).catch(() => null);

    let MPSText;

    if (client.options.intents.has(GatewayIntentBits.GuildPresences)) {
      MPSText = Object.entries(getAllMembersPresenceStatus(interaction.guild))
        .map(([status, count]) => `${emojis[status] ?? status} ${inlineCode(`${count}`)}`)
        .join("\n");
    } else {
      MPSText = Object.entries(interaction.guild.members.cache.reduce((acc, member) => {
        if (member.user.bot) {
          acc.bots++;
        } else {
          acc.users++;
        }
        return acc;
      }, {
        bots: 0,
        users: 0,
      }))
        .concat([["other", interaction.guild.memberCount - interaction.guild.members.cache.size]])
        .map(([key, value]) => `${t(key, interaction.locale)} ${inlineCode(`${value}`)}`)
        .join("\n");
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL() ?? undefined,
          })
          .setColor("Random")
          .setFields(
            {
              name: t("owner", interaction.locale),
              value: userMention(interaction.guild.ownerId),
              inline,
            },
            {
              name: t("id", interaction.locale),
              value: inlineCode(interaction.guild.id),
              inline,
            },
            {
              name: t("preferredLocale", interaction.locale),
              value: inlineCode(interaction.guild.preferredLocale),
              inline,
            },
            {
              name: `${t("members", interaction.locale)} [${interaction.guild.memberCount}]`,
              value: MPSText,
              inline,
            },
            {
              name: t("channels", interaction.locale),
              value: `${interaction.guild.channels.cache.size}`,
              inline,
            },
            {
              name: t("emojis", interaction.locale),
              value: `${interaction.guild.emojis.cache.size}`,
              inline,
            },
            {
              name: t("serverCreatedAt", interaction.locale),
              value: `${time(interaction.guild.createdAt)} ${time(interaction.guild.createdAt, "R")}`,
              inline,
            },
          )
          .setImage(interaction.guild.bannerURL({ size: 512 }))
          .setThumbnail(interaction.guild.iconURL()),
      ],
    });

    return;
  }

  async user(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = interaction.options.getMember("user") ??
      (user.id === interaction.user.id ? interaction.member : null);

    await user.fetch();

    const embeds = [
      new EmbedBuilder()
        .setThumbnail(user.displayAvatarURL())
        .setImage(user.bannerURL({ size: 512 }) ?? null),
    ];

    const components = <ActionRowBuilder<ButtonBuilder>[]>[];

    if ("tag" in user) {
      embeds[0].addFields({ name: t("discordTag", interaction.locale), value: inlineCode(user.tag) });
    }

    if ("id" in user) {
      embeds[0].addFields({ name: t("discordId", interaction.locale), value: inlineCode(user.id) });
    }

    if ("flags" in user && user.flags) {
      const flagsArray = user.flags.toArray().filter(flag => isNaN(+flag));
      const textFlags = flagsArray.map(flag => inlineCode(t(flag, interaction.locale))).join("\n") || "-";

      embeds[0].addFields({ name: `Flags [${flagsArray?.length ?? 0}]`, value: textFlags });
    }

    if ("createdAt" in user) {
      embeds[0].addFields({
        name: t("creationDate", interaction.locale),
        value: `${time(user.createdAt)} ${time(user.createdAt, "R")}`,
      });
    }

    if (member) {
      if ("joinedAt" in member && member.joinedAt) {
        embeds[0].addFields({
          name: t("joinedTheServerAt", interaction.locale),
          value: `${time(member.joinedAt)} ${time(member.joinedAt, "R")}`,
        });
      }

      if ("displayAvatarURL" in member) {
        embeds[0].setThumbnail(member.displayAvatarURL());
      }

      if ("displayColor" in member) {
        embeds[0].setColor(member.displayColor);
      }

      if ("roles" in member && member.roles instanceof BaseManager) {
        const arrayRoles = member.roles.cache.toJSON();
        const textRoles = arrayRoles.join(" ").replace("@everyone", "").trim() || "-";

        embeds[0].addFields([
          { name: t("role", interaction.locale), value: `${member.roles.highest}`, inline },
          { name: `${t("roles", interaction.locale)} [${arrayRoles.length - 1}]`, value: textRoles },
        ]);
      }

      if ("permissions" in member && member.permissions instanceof BitField) {
        const arrayPerms = member.permissions.toArray();
        const textPerms = arrayPerms.map(p => t(p, interaction.locale)).join(", ") || "-";

        embeds[0].addFields({
          name: `${t("permissions", interaction.locale)} [${arrayPerms.length}]`,
          value: codeBlock(textPerms),
        });
      }
    }

    if (interaction.guild) {
      const appPerms = interaction.appPermissions?.missing(PermissionFlagsBits.ManageGuild);

      if (appPerms?.length) {
        embeds[0].setFooter({
          text: t("missingFeaturePermissions", interaction.locale),
        });

        if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
          components.push(new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
              .setEmoji("🔐")
              .setLabel(t("grantMePermissions", interaction.locale))
              .setStyle(ButtonStyle.Link)
              .setURL(client.generateInvite({
                scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
                disableGuildSelect: true,
                guild: interaction.guild,
                permissions: commandHandler.permissions,
              }))));
        }
      } else {
        const integrations = await interaction.guild.fetchIntegrations();

        const integration = integrations?.find(i => i.account.id === user.id);

        if (integration?.application) {
          if (integration.application.description)
            embeds[0].setDescription(integration.application.description);

          if (integration.application.privacyPolicyURL || integration.application.termsOfServiceURL) {
            components.push(new ActionRowBuilder<ButtonBuilder>());

            if (integration.application.privacyPolicyURL)
              components[0]
                .addComponents(new ButtonBuilder()
                  .setLabel("Privacy policy")
                  .setStyle(ButtonStyle.Link)
                  .setURL(integration.application.privacyPolicyURL));

            if (integration.application.termsOfServiceURL)
              components[0]
                .addComponents(new ButtonBuilder()
                  .setLabel("Terms of service")
                  .setStyle(ButtonStyle.Link)
                  .setURL(integration.application.termsOfServiceURL));
          }
        }
      }
    }

    await interaction.editReply({ components, embeds });

    return;
  }
}
