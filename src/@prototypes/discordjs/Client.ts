import { Client } from "discord.js";
import { appStats } from "../../client";

Object.defineProperty(Client.prototype, "appStats", {
  get: function () {
    return appStats;
  },
});
