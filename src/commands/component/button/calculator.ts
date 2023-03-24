import { APIEmbed, ButtonInteraction, codeBlock, Colors } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "calculator",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { k } = JSON.parse(interaction.customId);

    const [embed] = interaction.message.embeds;

    const embedJson = this.resolvePressedKey(embed.toJSON(), k);

    if (embedJson.description!.length > 254)
      embedJson.description = this.displayBlock(`${Infinity}`);

    embedJson.color = this.randomFromObject(Colors);

    await interaction.update({ embeds: [embedJson] });

    return;
  }

  randomFromObject<T extends Record<string, any>>(obj: T) {
    const values = Object.values(obj);
    return values[Math.random() * values.length] as T[keyof T];
  }

  calculate(oldNumber: bigint | number | string, k: string, newNumber: bigint | number | string) {
    if (!newNumber) return `${oldNumber}`;

    oldNumber = Number(oldNumber);
    newNumber = Number(newNumber);

    switch (k) {
      case "+":
        newNumber = `${oldNumber + newNumber}`;
        break;
      case "-":
        newNumber = `${oldNumber - newNumber}`;
        break;
      case "*":
        newNumber = `${oldNumber * newNumber}`;
        break;
      case "/":
        newNumber = `${oldNumber / newNumber}`;
        break;
      default:
        newNumber = `${oldNumber}`;
        break;
    }

    return newNumber;
  }

  resolvePressedKey(embedJson: APIEmbed, k: string) {
    embedJson.description = this.scapeMd(embedJson.description!);

    if (["Infinity", "NaN"].includes(embedJson.description))
      embedJson = this.clear(embedJson);

    if (["+", "-", "*", "/"].includes(k))
      return this.setOperation(embedJson, k);

    switch (k) {
      case "=": {
        if (!embedJson.author) break;

        const [old, key] = embedJson.author.name.split(" ");

        embedJson.author = undefined;

        try {
          embedJson.description = this.calculate(old, key, embedJson.description!);
        } catch (error: any) {
          embedJson.description = `Error: ${error?.message}`;
        }
        break;
      }

      case "C":
        embedJson = this.clear(embedJson);
        break;

      case "<":
        if (embedJson.description === "0")
          if (embedJson.author) {
            embedJson.description = embedJson.author.name.split(" ")[0];
            embedJson.author = undefined;
            break;
          }

        embedJson.description = this.removeChar(embedJson.description!);
        break;

      case "+/-":
        embedJson.description = embedJson.description?.startsWith("-") ?
          embedJson.description!.slice(1) : `-${embedJson.description}`;
        break;

      case "x²":
        embedJson.description = `${Math.pow(Number(embedJson.description!), 2)}`;
        break;

      default:
        embedJson.description = this.addChar(embedJson.description!, k);
        break;
    }

    embedJson.description = this.displayBlock(embedJson.description!);

    return embedJson;
  }

  addChar(text: string, char: string) {
    if (char === "." && text.includes(".")) return text;

    if (["0", "-0"].includes(text)) text = text.replace(/0/, "");

    return `${text}${char}`;
  }

  removeChar(text: string) {
    text = text.slice(0, -1) || "0";

    return text === "-" ? "0" : text;
  }

  addOperation(embedJson: APIEmbed, k: string) {
    embedJson.author = { name: `${embedJson.description} ${k}` };
    embedJson.description = this.displayBlock("");

    return embedJson;
  }

  setOperation(embedJson: APIEmbed, k: string) {
    if (!embedJson.author) return this.addOperation(embedJson, k);

    const [old, key] = embedJson.author.name.split(" ");

    embedJson.author = undefined;

    try {
      embedJson.description = this.calculate(old, key, embedJson.description!);
    } catch (error: any) {
      embedJson.description = this.displayBlock(`Error: ${error?.message}`);

      return embedJson;
    }

    return this.addOperation(embedJson, k);
  }

  clear(embedJson: APIEmbed) {
    embedJson.description = "0";
    embedJson.author = undefined;

    return embedJson;
  }

  displayBlock(text: string) {
    return codeBlock(text.padStart(30));
  }

  scapeMd(text = "") {
    return text.replace(/`|\n| /gu, "");
  }
}
