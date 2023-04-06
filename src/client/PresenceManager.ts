import { ActivitiesOptions, ActivityType } from "discord.js";
import client, { appStats } from ".";

export default class PresenceManager {
  constructor() { }

  declare interval: NodeJS.Timer;

  readonly activities: ActivitiesOptions[] = [
    { name: "Cat Vibing Meme", type: ActivityType.Streaming, url: ytURL("NUYvbT6vTPs") },
    { name: "National Anthem of USSR", type: ActivityType.Streaming, url: ytURL("U06jlgpMtQs") },
    { name: "Noisestorm - Crab Rave", type: ActivityType.Streaming, url: ytURL("LDU_Txk06tM") },
    { name: "Rick Astley - Never Gonna Give You Up", type: ActivityType.Streaming, url: ytURL("dQw4w9WgXcQ") },
    { name: "Wide Putin Walking", type: ActivityType.Streaming, url: ytURL("SLU3oG_ePhM") },
    { name: `${appStats.guilds || "Fetching"} servers`, type: ActivityType.Competing },
    { name: `${appStats.channels || "Fetching"} channels`, type: ActivityType.Listening },
    { name: `${appStats.users || "Fetching"} users`, type: ActivityType.Watching },
  ];

  get shardActivities(): ActivitiesOptions[] {
    return [{
      name: `Shard ${appStats.shardId + 1}/${appStats.shards}`,
      type: ActivityType.Listening,
    }];
  }

  setPresence(shard = this.random) {
    client.user?.setPresence({
      activities: shard ? this.shardActivities : this.activities,
      shardId: shard ? appStats.shardId : undefined,
    });
  }

  private get random() {
    return Boolean(Math.round(Math.random()));
  }

  start() {
    this.stop();
    this.setPresence(true);
    this.interval = setInterval(() => this.setPresence(), 1000 * 60);
  }

  stop() {
    clearInterval(this.interval);
  }
}

function ytURL<s extends string>(s: s): `https://www.youtube.com/watch?v=${s}` {
  return `https://www.youtube.com/watch?v=${s}`;
}
