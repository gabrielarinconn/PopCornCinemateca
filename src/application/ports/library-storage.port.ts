/**
 * Lo mínimo de una película para pintarla en Mi Cineteca sin volver a
 * pedirle nada a TMDB.
 */
export interface SavedMovie {
  id: number;
  title: string;
  posterPath: string | null;
  savedAt: string;
}

/**
 * "Algo que guarda la biblioteca del usuario" — el resto de la app no sabe
 * que por dentro es `localStorage`, y no debería saberlo.
 */
export interface LibraryStoragePort {
  getSavedMovies(): SavedMovie[];
  saveMovie(movie: SavedMovie): void;
  removeMovie(movieId: number): void;
}
