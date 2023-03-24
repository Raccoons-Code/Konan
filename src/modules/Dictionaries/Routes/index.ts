import Util from "../Util";

export const Routes = new class Routes {
  [locale: string]: any

  get(locale: string) {
    return this[locale] ?? this[locale.split("-")[0]] ?? this.libreOfficeDic;
  }

  libreOfficeDic<locale extends string>(locale: locale) {
    locale = <locale>Util.formatLocale(locale);
    return `https://cgit.freedesktop.org/libreoffice/dictionaries/plain/${locale}/${locale}.dic`;
  }

  en() {
    return "https://www.wordgamedictionary.com/english-word-list/download/english.txt";
  }

  pt() {
    return "https://www.ime.usp.br/~pf/dicios/br-sem-acentos.txt";
  }
};
