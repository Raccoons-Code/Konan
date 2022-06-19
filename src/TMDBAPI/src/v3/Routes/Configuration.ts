export const Configuration = new class Configuration {
  /**
   * - GET `/configuration`
   */
  api(): '/configuration' {
    return '/configuration';
  }

  /**
   * - GET `/configuration/countries`
   */
  countries(): '/configuration/countries' {
    return '/configuration/countries';
  }

  /**
   * - GET `/configuration/jobs`
   */
  jobs(): '/configuration/jobs' {
    return '/configuration/jobs';
  }

  /**
   * - GET `/configuration/languages`
   */
  languages(): '/configuration/languages' {
    return '/configuration/languages';
  }

  /**
   * - GET `/configuration/primary_translations`
   */
  primaryTranslations(): '/configuration/primary_translations' {
    return '/configuration/primary_translations';
  }

  /**
   * - GET `/configuration/timezones`
   */
  timezones(): '/configuration/timezones' {
    return '/configuration/timezones';
  }
};

export default Configuration;