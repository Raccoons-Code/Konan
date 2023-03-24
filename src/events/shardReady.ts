import client, { appStats } from "../client";

client.on("shardReady", async function (_shardId, _unavailableGuilds) {
  await appStats.fetch();
});
