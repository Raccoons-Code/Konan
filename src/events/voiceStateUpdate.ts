import client, { appStats } from "../client";

client.on("voiceStateUpdate", async function (_oldState, _newState) {
  appStats.fetch({ filter: "voice_adapters" });
});
