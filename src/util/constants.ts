import { APIButtonComponentWithCustomId, ApplicationCommandOptionAllowedChannelTypes, ButtonStyle, ChannelType, GatewayIntentBits, GatewayIntentsString, GuildTextChannelType, Locale, PermissionFlagsBits, PermissionsString, version as djsVersion } from "discord.js";
import { readFileSync } from "node:fs";
import { cpus, totalmem, version } from "node:os";
import { extname, join } from "node:path";
import { env } from "node:process";

export const CLUSTER_ID = Number(env.PM2_INSTANCE_ID);

if (!isNaN(CLUSTER_ID)) {
  env.CLUSTER_ID = env.PM2_INSTANCE_ID;
  env.CLUSTERING = "true";
}

export const FILE_EXT = extname(__filename);

export const COMMANDS_PATH = join(__dirname, "..", "commands");
export const EVENTS_PATH = join(__dirname, "..", "events");

export const LOCALES = Object.values(Locale);

const packageJsonPath = join(__dirname, "..", "..", "package.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

export const VERSION: string = env.npm_package_version ?? packageJson.version;

export const DJS_VERSION = `${(djsVersion ??
  env.npm_package_dependencies_discord_js ??
  packageJson.dependencies["discord.js"])
  .match(/(?:\D*)([\d.]+)/)?.[1]}`;

const CPUs = cpus();

export const CPU_MODEL = CPUs[0].model;
export const CPU_CORES = CPUs.length;

export const TOTAL_RAM = totalmem();
export const OS_VERSION = version();

export const BUTTON_STYLES: {
  name: keyof typeof ButtonStyle,
  value: ButtonStyle
}[] = [
    { name: "Primary", value: ButtonStyle.Primary },
    { name: "Secondary", value: ButtonStyle.Secondary },
    { name: "Success", value: ButtonStyle.Success },
    { name: "Danger", value: ButtonStyle.Danger },
    { name: "Link", value: ButtonStyle.Link },
  ];

export const INTERACTION_BUTTON_STYLES: {
  name: Exclude<keyof typeof ButtonStyle, "Link">
  value: APIButtonComponentWithCustomId["style"]
}[] = [
    { name: "Primary", value: ButtonStyle.Primary },
    { name: "Secondary", value: ButtonStyle.Secondary },
    { name: "Success", value: ButtonStyle.Success },
    { name: "Danger", value: ButtonStyle.Danger },
  ];

export const GUILD_TEXT_CHANNEL_TYPES: Extract<ApplicationCommandOptionAllowedChannelTypes, GuildTextChannelType>[] = [
  ChannelType.AnnouncementThread,
  ChannelType.GuildAnnouncement,
  ChannelType.GuildForum,
  ChannelType.GuildStageVoice,
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.PrivateThread,
  ChannelType.PublicThread,
];

export const CONTENT_LENGTH = 4_096;

export const HELP_PAGE_LIMIT = 10;

export const MaxBulkDeletableMessageAge = 1_209_600_000;

export const INTENTS_STRING = Array.from(new Set(Object.keys(GatewayIntentBits)
  .filter(i => isNaN(+i) && i !== "GuildBans"))) as GatewayIntentsString[];

export const PERMISSIONS_STRING = <PermissionsString[]>Object.keys(PermissionFlagsBits);
