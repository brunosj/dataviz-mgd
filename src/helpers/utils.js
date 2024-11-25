export function parseGenres(genreString) {
  if (genreString.startsWith("['") && genreString.endsWith("']")) {
    genreString = genreString.substring(2, genreString.length - 2);
    return genreString.split("', '");
  }
  return [];
}
