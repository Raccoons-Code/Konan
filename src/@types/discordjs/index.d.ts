import { DiscordTogether } from 'discord-together';
import { Collection } from 'discord.js';
import ApplicationStats from '../../client/ApplicationStats';

declare module 'discord.js' {
  interface BaseInteraction {
    isAutocomplete(): this is AutocompleteInteraction
    isMessageComponent(): this is MessageComponentInteraction
    isModalSubmit(): this is ModalSubmitInteraction
  }

  interface Client {
    commands: Record<string, Collection<string, any>>
    discordTogether: DiscordTogether<Record<string, string>>
    invite: string
    stats: ApplicationStats

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