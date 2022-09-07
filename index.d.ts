declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_SECRET?: string
    CROWDIN_KEY?: string
    CROWDIN_TOKEN?: string
    DATABASE_URL?: string
    DISCORD_APPLICATION_ID?: string
    DISCORD_PUBLIC_KEY?: string
    DISCORD_TEST_GUILD_ID?: string
    DISCORD_TOKEN?: string
    DONATE_LINK?: string
    ERROR_WEBHOOK?: string
    GUILD_INVITE?: string
    LOGGER_WEBHOOK?: string
    NODE_ENV?: 'development' | 'production'
    OWNER_ID?: string
    PAYPAL_DONATE_LINK?: string
    STATCORD_KEY?: string
    TMDB_APIKEY?: string
    TOPGG_TOKEN?: string
  }
}