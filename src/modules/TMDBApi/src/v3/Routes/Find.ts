export const Find = new class Find {
  /**
   * - GET `/find/{external_id}`
   */
  byId<externalId extends string>(externalId: externalId): `/find/${externalId}` {
    return `/find/${externalId}`;
  }
};