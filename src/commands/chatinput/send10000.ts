import { Message } from "discord.js";
import Command from "../../structures/Command";

export default class extends Command {
  constructor() {
    super({
      name: "send10000",
      private: true,
    });
  }

  async execute(message: Message) {
    let i = 0;

    const interval = setInterval(async () => {
      i++;

      await message.channel.send(`${i}`);

      if (i > 9999) clearInterval(interval);
    }, 1000);
  }
}
