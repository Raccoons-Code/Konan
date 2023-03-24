import client, { appStats } from "../client";

client.on("voiceStateUpdate", async function (oldState, newState) {
  if (!oldState.channel && newState.channel) {
    appStats.totalVoiceAdapters++;
  }

  if (oldState.channel && !newState.channel) {
    appStats.totalVoiceAdapters--;
  }
});
