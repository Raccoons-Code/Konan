import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponentWithCustomId, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import { MemoryGameCustomId } from '../../@types';
import { MemoryGameCreateOptions } from './@types';
import Emojis from './emojis.json';

export const Memory = new class Memory {
  getGameMode(mode: number) {
    return ['solo', 'limited', 'coop', 'competitive'][mode];
  }

  gameMode = ['solo', 'limited', 'coop', 'competitive'];

  getEmojis(string = 'number') {
    return Emojis[<'number'>string] ?? Emojis.number;
  }

  get Emojis() {
    return <Record<string, string[]>>Object.fromEntries(Object.entries(Emojis).filter((a) => Array.isArray(a[1])));
  }

  create(options: MemoryGameCreateOptions) {
    if (!options.emojis) options.emojis = this.getEmojis('number');
    if (options.emojis.length > 12) throw new Error('Unable to create a Memory Game with more than 24 buttons.');

    const customOptions: Record<string, string | number> = {};

    if (options) {
      if (options.mode) customOptions.m = options.mode;
      if (options.time) customOptions.d = `${new Date(options.time).getTime()}`;
    }

    const buttons = this.#randomize(this.#duplicate(options.emojis)
      .map((emoji, i) => new ButtonBuilder()
        .setCustomId(JSON.stringify({ c: 'mg', e: emoji, v: i % 2, ...customOptions }))
        .setEmoji(Emojis.gray_question)
        .setStyle(ButtonStyle.Secondary)));

    const components = [];

    for (; buttons.length;)
      components.push(new ActionRowBuilder<ButtonBuilder>().setComponents(buttons.splice(0, 5)));

    return { components };
  }

  #duplicate<T = any>(array: T[]) {
    return array.reduce<T[]>((acc, cur) => acc.concat([cur, cur]), []);
  }

  #randomize<T = any>(array: T[]) {
    return array = array.sort(() => Math.random() - 0.5);
  }

  check(
    components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[],
    customId: string,
  ) {
    const id = <MemoryGameCustomId>JSON.parse(customId);

    const button = this.#getPrimaryButton(components, customId);

    if (button) {
      if (JSON.parse(button.custom_id).e === id.e) {
        components = this.#setSuccessButton(components, customId);
      } else {
        components = this.#setPrimaryButton(components, customId, true);
      }
    } else {
      components = this.#setPrimaryButton(components, customId);
    }

    return {
      components,
      play: button ? JSON.parse(button.custom_id).e === id.e ? 2 : 0 : 1,
      end: this.checkEnd(components),
      gameOver: this.checkGameOver(customId),
    };
  }

  get timeToEnd() {
    return new Date(Date.now() + (1000 * 60 * 2));
  }

  storeScore(players: string, player: string) {
    return players.replace(RegExp(`\`(\\d+)\` <@${player}|${player}> \`(\\d+)\``),
      (matched, num0, num1) => matched.replace(`\`${num0 ?? num1}\``, `\`${parseInt(num0 ?? num1) + 1}\``));
  }

  #getPrimaryButton(
    components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[],
    customId: string,
  ) {
    let button: APIButtonComponentWithCustomId | undefined;

    components.some(r =>
      r.toJSON().components.some(b => b.type === ComponentType.Button &&
        b.style === ButtonStyle.Primary && b.custom_id !== customId && (button = b)));

    return button;
  }

  checkEnd(components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[]) {
    return components.every(r =>
      r.toJSON().components.every(b =>
        b.type === ComponentType.Button && b.style === ButtonStyle.Success));
  }

  checkGameOver(customId: string) {
    const id = JSON.parse(customId);
    return [1].includes(id.m) && id.d < Date.now();
  }

  endGame(components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[]) {
    return components.map(r => {
      const rJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>r.toJSON();

      if (rJson.components[0].type !== ComponentType.Button) return r;

      return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(rJson.components.map(b => {
          const button = new ButtonBuilder(b);

          const { e } = JSON.parse(b.custom_id);

          return button
            .setDisabled(true)
            .setEmoji(e);
        }));
    });
  }

  #setPrimaryButton(
    components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[],
    customId: string,
    isSecondaryTry = false,
  ) {
    const id = <MemoryGameCustomId>JSON.parse(customId);

    return components.map(r => {
      const rJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>r.toJSON();

      if (rJson.components[0].type !== ComponentType.Button) return r;

      return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(rJson.components.map(b => {
          const button = new ButtonBuilder(b);

          if (b.custom_id !== customId)
            return button.setDisabled(isSecondaryTry || b.style === ButtonStyle.Success);

          return button
            .setDisabled(true)
            .setEmoji(id.e)
            .setStyle(ButtonStyle.Primary);
        }));
    });
  }

  setSecondaryButton(
    components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[],
  ) {
    return components.map(r => {
      const rJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>r.toJSON();

      if (rJson.components[0].type !== ComponentType.Button) return r;

      return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(rJson.components.map(b => {
          const button = new ButtonBuilder(b);

          if (b.style !== ButtonStyle.Primary)
            return button.setDisabled(b.style === ButtonStyle.Success);

          return button
            .setDisabled(false)
            .setEmoji(Emojis.question)
            .setStyle(ButtonStyle.Secondary);
        }));
    });
  }

  #setSuccessButton(
    components: (ActionRowBuilder<ButtonBuilder> | ActionRow<MessageActionRowComponent>)[],
    customId: string,
  ) {
    return components.map(r => {
      const rJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>r.toJSON();

      if (rJson.components[0].type !== ComponentType.Button) return r;

      return new ActionRowBuilder<ButtonBuilder>()
        .setComponents(rJson.components.map(b => {
          const button = new ButtonBuilder(b);

          if (b.style !== ButtonStyle.Primary && b.custom_id !== customId)
            return button.setDisabled(b.style === ButtonStyle.Success);

          return button
            .setDisabled(true)
            .setEmoji(JSON.parse(b.custom_id).e)
            .setStyle(ButtonStyle.Success);
        }));
    });
  }
};
