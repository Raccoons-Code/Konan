export const TVEpisodes = new class TVEpisodes {
  /**
   * - GET `/tv/{tvId}/season/{seasonNumber}/episode/{episodeNumber}`
   */
  details<tvId extends number, seasonNumber extends number, episodeNumber extends number>(
    tvId: tvId,
    seasonNumber: seasonNumber,
    episodeNumber: episodeNumber,
  ): `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}` {
    return `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`;
  }
};

export default TVEpisodes;