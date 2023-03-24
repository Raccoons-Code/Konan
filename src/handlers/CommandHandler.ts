/* eslint-disable no-await-in-loop */
import { APIApplicationCommand, BaseApplicationCommandData, Collection, PermissionsBitField, Routes } from "discord.js";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "node:process";
import { CommandTypes } from "../@enum";
import { CommandRegisterOptions } from "../@types";
import client from "../client";
import BaseApplicationCommand from "../structures/BaseApplicationCommand";
import BaseCommand from "../structures/BaseCommand";
import ChatInputCommand from "../structures/ChatInputCommand";
import { COMMANDS_PATH, FILE_EXT } from "../util/constants";
import { isClass } from "../util/utils";

class CommandHandler {
  commands = new Collection<string, Collection<string, BaseCommand>>();
  commandsByCategory = new Collection<string, Collection<string, ChatInputCommand>>();
  permissions = new PermissionsBitField();
  errors: Error[] = [];

  get applicationCommandTypes() {
    return Array.from(this.commands.keys()).filter(t => t.startsWith("application"));
  }

  get applicationCommands() {
    return this.commands
      .filter((v, k) => k.startsWith("application"))
      .toJSON()
      .flatMap(collection => collection.toJSON()) as BaseApplicationCommand[];
  }

  get chatInputApplicationCommands() {
    return this.commands
      .get(CommandTypes.ApplicationChatInput) as Collection<string, ChatInputCommand>;
  }

  async load(dir = COMMANDS_PATH) {
    if (!dir.startsWith(COMMANDS_PATH)) {
      dir = COMMANDS_PATH;
    }

    if (!existsSync(dir)) return;

    const files = readdirSync(dir, { withFileTypes: true });

    if (!files.length) return;

    const category = dir
      .replace(COMMANDS_PATH, "")
      .split(/[/\\]/)
      .join(".")
      .replace(/^\./, "");

    const commands = this.commands.get(category) ?? new Collection();

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

      const commandFile = imported.default ?? imported;

      const command = isClass(commandFile) ? new commandFile() : commandFile;

      if (!command.data || !command.execute) continue;

      if (typeof command.build === "function")
        command.build();

      if (command.options) {
        if (command.options.appPermissions)
          this.permissions.add(command.options.appPermissions);

        if (command.options.category) {
          const commandsByCategory =
            this.commandsByCategory.get(command.options.category) ??
            new Collection();

          commandsByCategory.set(command.data.name, command);

          this.commandsByCategory.set(command.options.category, commandsByCategory);
        }
      }

      commands.set(command.data.name, command);

      continue;
    }

    if (commands.size)
      this.commands.set(category, commands);

    await Promise.all(promisesDir);
  }

  async register(options?: CommandRegisterOptions) {
    options = {
      ...options,
      appId: options?.appId ?? client.user?.id ?? env.DISCORD_APPLICATION_ID,
      guilds: options?.guilds ?? env.DISCORD_TEST_GUILD_ID?.split(/\s*,\s*/),
      token: options?.token ?? client.token ?? env.DISCORD_TOKEN,
    };

    if (!options.appId || !options.token)
      throw Error(
        "Missing required params:"
        + (options.appId ? "" : " DISCORD_APPLICATION_ID")
        + (options.token ? "" : " DISCORD_TOKEN"),
      );

    const data: BaseApplicationCommandData[] = [];
    const dataPrivate: BaseApplicationCommandData[] = [];

    const commands = this.applicationCommands;

    for (const command of commands) {
      try {
        const commandData = command.data.toJSON();

        if (command.options.private) {
          dataPrivate.push(commandData);

          continue;
        }

        options.reset || data.push(commandData);
      } catch (error) {
        console.error(error);
      }
    }

    try {
      if (options.global) {
        console.log("Started refreshing application (/) commands.");

        await client.rest.put(Routes.applicationCommands(options.appId), {
          body: data,
        });

        if (options.guilds?.length) {
          for (const id of options.guilds) {
            const guildCommands = await client.rest.get(Routes.applicationGuildCommands(options.appId, id)) as APIApplicationCommand[];

            const guildCommandsData = guildCommands.filter(guildCommand =>
              dataPrivate.every(command => command.name !== guildCommand.name));

            await client.rest.put(Routes.applicationGuildCommands(options.appId, id), {
              body: guildCommandsData.concat(<any>dataPrivate),
            });
          }
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      } else {
        if (options.guilds?.length) {
          const guildCommandsData = data.concat(dataPrivate);

          console.log(`Started refreshing ${guildCommandsData.length} application (/) commands.`);

          for (const id of options.guilds) {
            await client.rest.put(Routes.applicationGuildCommands(options.appId, id), {
              body: guildCommandsData,
            });

            console.log(`Successfully reloaded application (/) commands for guild ${id}.`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const commandHandler = new CommandHandler();

export default commandHandler;
