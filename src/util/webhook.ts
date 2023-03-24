import { Channel, ChannelResolvable } from "discord.js";
import client from "../client";

export async function findOrCreateChannelWebhook(channel: ChannelResolvable, reason?: string) {
  if (typeof channel === "string") {
    channel = await client.channels.fetch(channel) as Channel;
  }

  if ("fetchWebhooks" in channel) {
    const webhook = await channel.fetchWebhooks()
      .then(whs => whs.find(wh => wh.applicationId === client.user?.id))
      .catch(() => null);

    return webhook ?? channel.createWebhook({
      name: `${client.user?.tag}`,
      avatar: client.user?.avatarURL(),
      reason,
    }).catch(() => null);
  }
}
