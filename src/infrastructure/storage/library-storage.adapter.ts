import { z } from 'zod';
import type { LibraryStoragePort, SavedMovie } from '@/application/ports/library-storage.port';

const STORAGE_KEY = 'cineteca:library';

const SavedMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterPath: z.string().nullable(),
  savedAt: z.string(),
});

const SavedMoviesSchema = z.array(SavedMovieSchema);

/**
 * Se valida al leer aunque lo haya escrito la propia app — alguien pudo
 * editar `localStorage` a mano, o una versión anterior de la app pudo
 * escribir una forma distinta. Un dato corrupto se descarta sin tumbar la
 * app; nunca una afirmación de tipo (`as`) sobre lo que salió de aquí.
 */
function readSavedMovies(): SavedMovie[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const result = SavedMoviesSchema.safeParse(parsed);
  return result.success ? result.data : [];
}

function writeSavedMovies(movies: SavedMovie[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export const libraryStoragePort: LibraryStoragePort = {
  getSavedMovies: readSavedMovies,

  saveMovie(movie) {
    const current = readSavedMovies();
    if (current.some((saved) => saved.id === movie.id)) return;
    writeSavedMovies([...current, movie]);
  },

  removeMovie(movieId) {
    const current = readSavedMovies();
    writeSavedMovies(current.filter((saved) => saved.id !== movieId));
  },
};
