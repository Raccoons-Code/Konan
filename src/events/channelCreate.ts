import client, { appStats } from "../client";

client.on("channelCreate", async function (_channel) {
  await appStats.fetch();
});
