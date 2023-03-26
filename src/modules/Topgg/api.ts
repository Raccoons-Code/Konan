import { Api } from "@top-gg/sdk";
import { env } from "node:process";

let api: Api | undefined;

if (env.TOPGG_TOKEN) {
  try {
    api = new Api(env.TOPGG_TOKEN);
  } catch (error) {
    console.error(error);
  }
}

export default api;
