import client, { appStats } from "../client";

client.on("emojiCreate", async function (_emoji) {
  appStats.totalEmojis++;
});
