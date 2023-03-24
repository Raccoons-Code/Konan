import { BUTTON_STYLES, INTERACTION_BUTTON_STYLES } from "../constants";
import { mathRandom } from "../utils";

export function getRandomButtonStyle() {
  return BUTTON_STYLES[mathRandom(BUTTON_STYLES)];
}

export function getRandomInteractionButtonStyle() {
  return INTERACTION_BUTTON_STYLES[mathRandom(INTERACTION_BUTTON_STYLES)];
}
