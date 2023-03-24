import client, { appStats } from "../client";

client.on("channelCreate", async function (_channel) {
  appStats.totalChannels++;
});
