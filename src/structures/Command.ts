import { Message } from "discord.js";
import { CommandData } from "../@types";

export default abstract class Command {
  constructor(public readonly data: CommandData) { }

  abstract execute(message: Message): Promise<any>;
}
