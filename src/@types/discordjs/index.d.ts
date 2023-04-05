import "discord.js";

declare module "discord.js" {
  interface Client {
    get interactions(): number;
  }

  interface Message {
    args?: string[]
    commandName?: string
    text?: string
  }
}
