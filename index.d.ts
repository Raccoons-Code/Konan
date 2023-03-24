declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string
    DISCORD_APPLICATION_ID?: string
    DISCORD_APPLICATION_SECRET?: string
    DISCORD_ERROR_CHANNEL?: string
    DISCORD_GUILD_ID?: string
    DISCORD_GUILD_INVITE?: string
    DISCORD_GUILD_INVITE_CHANNEL?: string
    DISCORD_LOG_CHANNEL?: string
    DISCORD_PUBLIC_KEY?: string
    DISCORD_TEST_GUILD_ID?: string
    DISCORD_TOKEN?: string
  }
}
