import { APIEmbedField, Collection, Embed, StringSelectMenuOptionBuilder } from "discord.js";

interface Options {
  emptyValue: string
  names: string[]
  namePatterns: RegExp[]
}

export function getEmbedFields(
  embeds: Embed[],
  options: Partial<Options> = {},
) {
  const embedsCollection = new Collection<number, Collection<number, APIEmbedField>>();

  if (options.names?.length) {
    options.namePatterns ??= [];
    options.namePatterns.push(RegExp(`^(${options.names.join("|")})$`, "i"));
  }

  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i];

    const embedFields = embedsCollection.get(i) ?? new Collection<number, APIEmbedField>();

    for (let j = 0; j < embed.fields.length; j++) {
      const field = embed.fields[j];

      if (options.emptyValue && options.namePatterns) {
        if (
          field.value !== options.emptyValue &&
          options.namePatterns.some(pattern => pattern.test(field.name))
        ) {
          embedsCollection.set(i, embedFields.set(j, field));
          continue;
        }
      }

      if (
        options.emptyValue &&
        field.value !== options.emptyValue
      ) {
        embedsCollection.set(i, embedFields.set(j, field));
        continue;
      }

      if (
        options.namePatterns &&
        options.namePatterns.some(pattern => pattern.test(field.name))
      ) {
        embedsCollection.set(i, embedFields.set(j, field));
        continue;
      }
    }
  }

  return embedsCollection;
}

export function getSelectOptionsFromEmbedFields(
  embedFields: Collection<number, APIEmbedField>,
) {
  const options: StringSelectMenuOptionBuilder[] = [];

  for (const [i, field] of embedFields) {
    options.push(
      new StringSelectMenuOptionBuilder()
        .setDescription(field.value.slice(0, 100) || " ")
        .setLabel(field.name.slice(0, 100))
        .setValue(JSON.stringify({
          i,
          n: field.name.slice(0, 85),
        })),
    );
  }

  return options;
}
