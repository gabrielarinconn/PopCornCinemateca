import { z } from 'zod';
import { ListFormSchema } from '@/application/ports/list-storage.port';
import type {
  ListFormValues,
  ListStoragePort,
  MovieList,
} from '@/application/ports/list-storage.port';

const STORAGE_KEY = 'cineteca:lists';

const MovieListSchema = ListFormSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});
const MovieListsSchema = z.array(MovieListSchema);

/**
 * Se valida al leer aunque lo haya escrito la propia app — un dato corrupto
 * se descarta sin tumbar la app, nunca una afirmación de tipo sobre lo que
 * salió de `localStorage`.
 */
function readLists(): MovieList[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const result = MovieListsSchema.safeParse(parsed);
  return result.success ? result.data : [];
}

function writeLists(lists: MovieList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${String(Date.now())}-${Math.random().toString(36).slice(2)}`;
}

export const listStoragePort: ListStoragePort = {
  getLists: readLists,

  getList(id) {
    return readLists().find((list) => list.id === id);
  },

  createList(input: ListFormValues) {
    const current = readLists();
    const newList: MovieList = { ...input, id: generateId(), createdAt: new Date().toISOString() };
    writeLists([...current, newList]);
    return newList;
  },

  updateList(id, input) {
    const current = readLists();
    writeLists(current.map((list) => (list.id === id ? { ...list, ...input } : list)));
  },

  deleteList(id) {
    writeLists(readLists().filter((list) => list.id !== id));
  },
};
