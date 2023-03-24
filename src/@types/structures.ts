import { BitFieldResolvable, GatewayIntentsString, Partials, PermissionsString } from "discord.js";
import { CommandCategory } from "../@enum";

interface BaseOptions {
  private?: boolean
  appPermissions?: BitFieldResolvable<PermissionsString, bigint>
  userPermissions?: BitFieldResolvable<PermissionsString, bigint>
  channelAppPermissions?: BitFieldResolvable<PermissionsString, bigint>
  channelUserPermissions?: BitFieldResolvable<PermissionsString, bigint>
}

export interface ApplicationCommandOptions extends BaseOptions {
  category?: `${CommandCategory}`
}

export interface CommandData extends BaseOptions {
  name: string
  description?: string
}

export type CommandOptions = BaseOptions;

export interface ComponentCommandData extends BaseOptions {
  name: string
}

export interface EventOptions extends BaseOptions {
  intents?: BitFieldResolvable<GatewayIntentsString, number>
  partials?: Partials[]
}
