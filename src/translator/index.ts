import { Locale } from "discord.js";
import Translator from "../modules/Translator/src";
import resources from "./resources";

const Locales = { ...Locale, English: "en" };

Translator.init({ resources, capitalize: true, Locales });

export default Translator;

export const t = Translator.t;
