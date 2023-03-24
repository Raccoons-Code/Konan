import { env } from "node:process";
import client, { appStats, logger, presence } from "../client";
import commandHandler from "../handlers/CommandHandler";

client.once("ready", async function () {
  console.log("Ready!");

  if (env.DISCORD_ERROR_CHANNEL) {
    try {
      logger.ERROR_WEBHOOK = await logger.findOrCreate(env.DISCORD_ERROR_CHANNEL);
    } catch (error) {
      console.error(error);
    }
  }

  await commandHandler.load();

  if (env.DISCORD_LOG_CHANNEL) {
    try {
      logger.LOG_WEBHOOK = await logger.findOrCreate(env.DISCORD_LOG_CHANNEL);
    } catch (error) {
      console.error(error);
    }
  }

  await Promise.all([
    commandHandler.register({
      reset: env.NODE_ENV === "production",
    }),

    client.application?.fetch(),
    client.application?.commands.fetch(),

    appStats.fetch(),
  ]);

  presence.init();
  presence.start();

  console.log("Ready! End!");
});
