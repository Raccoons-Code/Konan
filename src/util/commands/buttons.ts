import { BUTTON_STYLES, INTERACTION_BUTTON_STYLES } from "../constants";
import { randomInt } from "../utils";

export function getRandomButtonStyle() {
  return BUTTON_STYLES[randomInt(BUTTON_STYLES)];
}

export function getRandomInteractionButtonStyle() {
  return INTERACTION_BUTTON_STYLES[randomInt(INTERACTION_BUTTON_STYLES)];
}
