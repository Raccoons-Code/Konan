import { Partials } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import client from "../client";
import { EVENTS_PATH, FILE_EXT } from "../util/constants";

class EventHandler {
  intents = client.options.intents;
  partials: Partials[] = client.options.partials ?? [];
  errors: Error[] = [];

  async load(dir = EVENTS_PATH) {
    if (!dir.startsWith(EVENTS_PATH)) {
      dir = EVENTS_PATH;
    }

    const files = readdirSync(dir, { withFileTypes: true });

    const promisesDir = [];
    const promisesFile = [];

    for (const file of files) {
      if (file.isDirectory()) {
        promisesDir.push(this.load(join(dir, file.name)));

        continue;
      }

      if (file.isFile()) {
        if (!file.name.endsWith(FILE_EXT)) continue;

        promisesFile.push(import(`${join(dir, file.name)}`)
          .catch(error => {
            this.errors.push(error);
          }));

        continue;
      }
    }

    const importedFiles = await Promise.all(promisesFile);

    for (const imported of importedFiles) {
      if (!imported) continue;

      if ("options" in imported) {
        if ("intents" in imported.options) {
          this.intents.add(imported.options.intents);
        }

        if ("partials" in imported.options) {
          this.partials.push(...imported.options.partials ?? []);
        }
      }

      continue;
    }

    await Promise.all(promisesDir);

    client.options.intents = this.intents;

    client.options.partials = this.partials = Array.from(new Set(this.partials));
  }
}

const eventHandler = new EventHandler();

export default eventHandler;
