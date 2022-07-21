export const TVSeasons = new class TVSeasons {
  /**
   * - GET `/tv/{tvId}/season/{seasonNumber}`
   */
  details<tvId extends number, seasonNumber extends number>(
    tvId: tvId,
    seasonNumber: seasonNumber,
  ): `/tv/${tvId}/season/${seasonNumber}` {
    return `/tv/${tvId}/season/${seasonNumber}`;
  }
};