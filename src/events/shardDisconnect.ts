import client from "../client";

client.on("shardDisconnect", async function (closeEvent, shardId) {
  console.log(shardId);
});
