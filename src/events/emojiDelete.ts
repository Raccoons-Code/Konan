import client, { appStats } from "../client";

client.on("emojiDelete", async function (_emoji) {
  appStats.fetch({ filter: "emojis" });
});
