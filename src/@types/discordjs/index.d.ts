import 'discord.js';

declare module 'discord.js' {
  interface Client {
    invite: string

    sendError(reason: Error): Promise<void>
    topggAutoposter(token?: string | undefined): Promise<void>
  }

  interface GuildMember {
    isBannableBy(member: GuildMember): boolean
    isKickableBy(member: GuildMember): boolean
    isManageableBy(member: GuildMember): boolean
    isModeratableBy(member: GuildMember): boolean
  }

  interface GuildMemberManager {
    get allMembersPresenceStatus(): Record<PresenceStatus, number>
  }

  interface GuildMemberRoleManager {
    get lowest(): Role
  }

  interface Message {
    args: string[]
    commandName: string
    text: string
  }

  interface MessageManager {
    safeFetch(options: MessageResolvable): Promise<Message | null>
  }
}