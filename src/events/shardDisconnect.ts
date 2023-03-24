import client, { appStats } from "../client";

client.on("shardDisconnect", async function (_closeEvent, _shardId) {
  await appStats.fetch();
});
