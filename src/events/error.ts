import client, { logger } from "../client";

client.on("error", async function (error) {
  await logger.commonError(error);
});
