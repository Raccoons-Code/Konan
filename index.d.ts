declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_ID?: string
    CLIENT_SECRET?: string
    CROWDIN_KEY?: string
    CROWDIN_TOKEN?: string
    DATABASE_URL?: string
    DISCORD_TOKEN?: string
    DONATE_LINK?: string
    ERROR_WEBHOOK?: string
    GUILD_ID?: string
    GUILD_INVITE?: string
    OWNER_ID?: string
    PAYPAL_DONATE_LINK?: string
    STATCORD_KEY?: string
    TMDB_APIKEY?: string
    TOPGG_TOKEN?: string
  }
}

declare module 'discord-tictactoe' {
  export default class TicTacToe {
    constructor(options?: { language?: string })
    handleInteraction(interaction: any): void
  }
}