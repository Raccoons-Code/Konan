import { Client } from "discord.js";
import { appStats } from "../../client";

Object.defineProperty(Client.prototype, "interactions", {
  get: function () {
    return appStats.interactions;
  },
});
