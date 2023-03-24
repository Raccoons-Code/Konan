import "discord.js";

declare module "discord.js" {
  interface Message {
    args?: string[]
    commandName?: string
    text?: string
  }
}
