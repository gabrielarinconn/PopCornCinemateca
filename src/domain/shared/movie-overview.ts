export interface MovieOverview {
  text: string;
  isFallbackToEnglish: boolean;
}

/**
 * Si la sinopsis en el idioma del usuario viene vacía, TMDB simplemente no
 * tiene esa traducción — no es un error de red ni un hueco, es un estado
 * del producto. Se ofrece la versión en inglés con un aviso explícito.
 */
export function resolveMovieOverview(
  primaryOverview: string,
  englishOverview: string,
): MovieOverview {
  if (primaryOverview !== '') {
    return { text: primaryOverview, isFallbackToEnglish: false };
  }
  return { text: englishOverview, isFallbackToEnglish: true };
}
