import { stripIndents } from "common-tags";
import { ActionRowBuilder, BaseManager, BitField, ButtonBuilder, ButtonStyle, calculateShardId, ChannelType, ChatInputCommandInteraction, codeBlock, EmbedBuilder, inlineCode, time, userMention } from "discord.js";
import ms from "ms";
import { memoryUsage, versions } from "node:process";
import client, { appStats } from "../../../client";
import ChatInputCommand from "../../../structures/ChatInputCommand";
import { t } from "../../../translator";
import Bytes from "../../../util/Bytes";
import { getAllMembersPresenceStatus } from "../../../util/commands/utils";
import { CPU_CORES, CPU_MODEL, DJS_VERSION, OS_VERSION, TOTAL_RAM, VERSION } from "../../../util/constants";
import emojis from "../../../util/emojis";
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

    const heapUsed = memoryUsage().heapUsed;

    const engine = stripIndents(`
      Node : ${versions.node}
    `);

    const library = stripIndents(`
      Discord.js : ${DJS_VERSION}
    `);

    const machine = stripIndents(`
      CPU : ${CPU_MODEL} (${CPU_CORES} cores)
      OS  : ${OS_VERSION}
      RAM : ${new Bytes(heapUsed)} / ${new Bytes(TOTAL_RAM)}
    `);

    const stats: [string, string | number][] = [
      ["Ping", `${client.ws.ping}ms`],
    ];

    if (client.shard) {
      if (interaction.guildId) {
        const id = calculateShardId(interaction.guildId, client.shard.count);

        stats.unshift(["Shard", `${id + 1}/${client.shard.count}`]);
      } else {
        stats.unshift(["Shards", `${client.shard.count}`]);
      }
    }

    if (VERSION)
      stats.push(["Version", VERSION]);

    await appStats.fetch({ filter: "users" });

    stats.unshift(
      ["Servers", appStats.guilds < appStats.totalGuilds ?
        `${appStats.guilds}/${appStats.totalGuilds}` :
        appStats.guilds],
      ["Channels", appStats.channels < appStats.totalChannels ?
        `${appStats.channels}/${appStats.totalChannels}` :
        appStats.channels],
      ["Users", appStats.users < appStats.totalUsers ?
        `${appStats.users}/${appStats.totalUsers}` :
        appStats.users],
      ["Emojis", appStats.emojis < appStats.totalEmojis ?
        `${appStats.emojis}/${appStats.totalEmojis}` :
        appStats.emojis],
      ["Messages", appStats.messages],
      ["Interactions", appStats.interactions],
    );


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
            { name: "Stats", value: codeBlock("c", makeTable(stats)) },
            { name: "Machine", value: codeBlock("c", machine) },
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
    const locale = interaction.locale;

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
        name: t("bitrate", { locale }),
        value: `${channel.bitrate / 1000}kb's`,
        inline,
      });
    }

    if ("full" in channel) {
      embeds[0].addFields({ name: t("full", { locale }), value: t(`${channel.full}`, { locale }), inline });
    }

    if ("memberCount" in channel && typeof channel.memberCount === "number") {
      embeds[0].addFields({ name: t("memberCount", { locale }), value: `${channel.memberCount}`, inline });
    }

    if ("messageCount" in channel && typeof channel.messageCount === "number") {
      embeds[0].addFields({
        name: t("messageCount", { locale }),
        value: `${channel.messageCount}`,
        inline,
      });
    }

    if ("nsfw" in channel) {
      embeds[0].addFields({ name: "NSFW", value: t(`${channel.nsfw}`, { locale }), inline });
    }

    if ("parent" in channel && channel.parent) {
      embeds[0].addFields({ name: t("category", { locale }), value: `${channel.parent}`, inline });
    }

    if ("rateLimitPerUser" in channel && typeof channel.rateLimitPerUser === "number") {
      embeds[0].addFields({
        name: t("slowmode", { locale }),
        value: ms(channel.rateLimitPerUser * 1000),
        inline,
      });
    }

    if ("rtcRegion" in channel) {
      embeds[0].addFields({
        name: t("rtcRegion", { locale }),
        value: channel.rtcRegion ?? t("automatic", { locale }),
        inline,
      });
    }

    if ("topic" in channel && typeof channel.topic === "string") {
      embeds[0].addFields({ name: t("topic", { locale }), value: channel.topic, inline });
    }

    if ("type" in channel) {
      const ct = `${ChannelType[channel.type]}`.match(/([A-Z]{1,}[a-z]*)+/)?.[1];

      embeds[0].addFields({ name: t("type", { locale }), value: t(`${ct}`, { locale }), inline });
    }

    if ("userLimit" in channel) {
      embeds[0].addFields({
        name: t("userLimit", { locale }),
        value: `${channel.userLimit || ":infinity:"}`,
        inline,
      });
    }

    if ("flags" in channel) {
      const arrayFlags = channel.flags.toArray();
      const textFlags = arrayFlags.join(" ").trim() || "-";

      embeds[0].addFields({ name: t("flags", { locale }), value: textFlags });
    }

    if ("children" in channel && channel.children instanceof BaseManager) {
      const arrayChildren = channel.children.cache.toJSON();
      const textChildren = arrayChildren.join(" ").trim() || "-";

      embeds[0].addFields({
        name: `${t("channels", { locale })} [${arrayChildren.length}]`,
        value: textChildren,
      });
    }

    if ("threads" in channel && channel.threads instanceof BaseManager) {
      const arrayThreads = channel.threads.cache.toJSON();
      const textThreads = arrayThreads.join(" ").trim() || "-";

      embeds[0].addFields({
        name: `${t("threads", { locale })} [${arrayThreads.length}]`,
        value: textThreads,
      });
    }

    if ("createdAt" in channel && channel.createdAt) {
      embeds[0].addFields({
        name: t("creationDate", { locale }),
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

    const locale = interaction.locale;
    const role = interaction.options.getRole("role", true);

    const arrayPerms = role.permissions.toArray();
    const textPerms = arrayPerms.map(p => t(p, { locale })).join(", ") || "-";

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(role.color || "Random")
          .setAuthor({ name: role.name, iconURL: role.iconURL() ?? undefined })
          .setFields([
            { name: t("mentionable", { locale }), value: t(`${role.mentionable}`, { locale }), inline },
            { name: t("members", { locale }), value: `${role.members.size}`, inline },
            { name: `${t("permissions", { locale })} [${arrayPerms.length}]`, value: codeBlock(textPerms) },
            { name: "Bot role", value: t(`${Boolean(role.tags?.botId)}`, { locale }), inline },
            { name: "Integration role", value: t(`${Boolean(role.tags?.integrationId)}`, { locale }), inline },
            { name: "Subscriber role", value: t(`${Boolean(role.tags?.premiumSubscriberRole)}`, { locale }), inline },
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

    const guild = interaction.guild;
    const locale = interaction.locale;

    await Promise.all([
      guild.fetch(),
      guild.members.fetch({ withPresences: true }),
    ]);

    const MPSText = Object.entries(getAllMembersPresenceStatus(guild))
      .map(([status, count]) => `${emojis[status] ?? status} ${inlineCode(`${count}`)}`)
      .join("\n");

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined })
          .setColor("Random")
          .setFields(
            { name: t("owner", { locale }), value: userMention(guild.ownerId), inline },
            { name: t("id", { locale }), value: inlineCode(guild.id), inline },
            { name: t("preferredLocale", { locale }), value: inlineCode(guild.preferredLocale), inline },
            { name: `${t("members", { locale })} [${guild.memberCount}]`, value: MPSText, inline },
            { name: t("channels", { locale }), value: `${guild.channels.cache.size}`, inline },
            { name: t("emojis", { locale }), value: `${guild.emojis.cache.size}`, inline },
            {
              name: t("serverCreatedAt", { locale }),
              value: `${time(guild.createdAt)} ${time(guild.createdAt, "R")}`,
              inline,
            },
          )
          .setImage(guild.bannerURL({ size: 512 }))
          .setThumbnail(guild.iconURL()),
      ],
    });

    return;
  }

  async user(interaction: ChatInputCommandInteraction) {
    const locale = interaction.locale;

    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = interaction.options.getMember("user") ?? interaction.member;

    await user.fetch();

    const embeds = [
      new EmbedBuilder()
        .setThumbnail(user.displayAvatarURL())
        .setImage(user.bannerURL({ size: 512 }) ?? null),
    ];

    const components = <ActionRowBuilder<ButtonBuilder>[]>[];

    if ("createdAt" in user) {
      embeds[0].addFields({
        name: t("creationDate", { locale }),
        value: `${time(user.createdAt)} ${time(user.createdAt, "R")}`,
        inline,
      });
    }

    if ("id" in user) {
      embeds[0].addFields({ name: t("discordId", { locale }), value: inlineCode(user.id), inline });
    }

    if ("tag" in user) {
      embeds[0].addFields({ name: t("discordTag", { locale }), value: inlineCode(user.tag), inline });
    }

    if ("flags" in user && user.flags) {
      const flagsArray = user.flags.toArray();
      const textFlags = flagsArray.map(flag => inlineCode(t(flag, { locale }))).join("\n") || "-";

      embeds[0].addFields({ name: `Flags [${flagsArray?.length ?? 0}]`, value: textFlags });
    }

    if (member) {
      if ("displayAvatarURL" in member) {
        embeds[0].setThumbnail(member.displayAvatarURL());
      }

      if ("displayColor" in member) {
        embeds[0].setColor(member.displayColor);
      }

      if ("joinedAt" in member && member.joinedAt) {
        embeds[0].addFields({
          name: t("joinedTheServerAt", { locale }),
          value: `${time(member.joinedAt)} ${time(member.joinedAt, "R")}`,
        });
      }

      if ("roles" in member && member.roles instanceof BaseManager) {
        const arrayRoles = member.roles.cache.toJSON();
        const textRoles = arrayRoles.join(" ").replace("@everyone", "").trim() || "-";

        embeds[0].addFields([
          { name: t("role", { locale }), value: `${member.roles.highest}`, inline },
          { name: `${t("roles", { locale })} [${arrayRoles.length - 1}]`, value: textRoles },
        ]);
      }

      if ("permissions" in member && member.permissions instanceof BitField) {
        const arrayPerms = member.permissions.toArray();
        const textPerms = arrayPerms.map(p => t(p, { locale })).join(", ") || "-";

        embeds[0].addFields({
          name: `${t("permissions", { locale })} [${arrayPerms.length}]`,
          value: codeBlock(textPerms),
        });
      }
    }

    if (interaction.guild) {
      const integrations = await interaction.guild.fetchIntegrations();

      const integration = integrations.find(i => i.account.id === user.id);

      if (integration) {
        if (integration.application) {
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
