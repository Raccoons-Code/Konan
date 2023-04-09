import { Client } from "discord.js";
import { appStats } from "../../client";

Object.defineProperties(Client.prototype, {
  appStats: {
    get: function () {
      return appStats;
    },
  },
});
