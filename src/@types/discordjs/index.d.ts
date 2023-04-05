import "discord.js";
import ApplicationStats from "../../client/ApplicationStats";

declare module "discord.js" {
  interface Client {
    get appStats(): ApplicationStats
  }

  interface Message {
    args?: string[]
    commandName?: string
    text?: string
  }
}
