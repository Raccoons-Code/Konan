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

  await Promise.all([
    commandHandler.register({
      reset: env.NODE_ENV === "production",
    }),

    env.DISCORD_LOG_CHANNEL &&
    logger.findOrCreate(env.DISCORD_LOG_CHANNEL)
      .then(webhook => { logger.LOG_WEBHOOK = webhook; })
      .catch(() => null),

    appStats.fetch(),

    client.application?.fetch(),
  ]);

  presence.start();

  console.log("Ready! End!");
});
