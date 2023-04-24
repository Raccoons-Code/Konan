declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string
    DISCORD_APPLICATION_ID?: string
    DISCORD_APPLICATION_PUBLIC_KEY?: string
    DISCORD_APPLICATION_SECRET?: string
    DISCORD_DM_FORWARD_USER_ID?: string
    DISCORD_ERROR_CHANNEL?: string
    DISCORD_GUILD_ID?: string
    DISCORD_GUILD_INVITE?: string
    DISCORD_GUILD_INVITE_CHANNEL?: string
    DISCORD_LOG_CHANNEL?: string
    DISCORD_TEST_GUILD_ID?: string
    DISCORD_TOKEN?: string
    NODE_ENV?: "development" | "production"
    TOPGG_TOKEN?: string
  }
}
