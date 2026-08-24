import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { libraryStoragePort } from './library-storage.adapter';

const STORAGE_KEY = 'cineteca:library';

const movie = {
  id: 1,
  title: 'El padrino',
  posterPath: '/poster.jpg',
  savedAt: '2026-01-01T00:00:00.000Z',
};

describe('libraryStoragePort', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('empieza vacío cuando no hay nada guardado', () => {
    expect(libraryStoragePort.getSavedMovies()).toEqual([]);
  });

  it('guarda y devuelve la película', () => {
    libraryStoragePort.saveMovie(movie);
    expect(libraryStoragePort.getSavedMovies()).toEqual([movie]);
  });

  it('no duplica una película que ya estaba guardada', () => {
    libraryStoragePort.saveMovie(movie);
    libraryStoragePort.saveMovie(movie);
    expect(libraryStoragePort.getSavedMovies()).toHaveLength(1);
  });

  it('quita una película guardada', () => {
    libraryStoragePort.saveMovie(movie);
    libraryStoragePort.removeMovie(movie.id);
    expect(libraryStoragePort.getSavedMovies()).toEqual([]);
  });

  it('quitar una película que no estaba guardada no revienta', () => {
    expect(() => {
      libraryStoragePort.removeMovie(999);
    }).not.toThrow();
  });

  it('descarta un JSON corrupto en localStorage sin tumbar la app', () => {
    localStorage.setItem(STORAGE_KEY, '{esto no es JSON válido');
    expect(libraryStoragePort.getSavedMovies()).toEqual([]);
  });

  it('descarta datos manipulados a mano que no cumplen el schema', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'no-es-un-número', title: 42 }]));
    expect(libraryStoragePort.getSavedMovies()).toEqual([]);
  });

  it('descarta el valor si alguien guardó un objeto en vez de un arreglo', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 1 }));
    expect(libraryStoragePort.getSavedMovies()).toEqual([]);
  });
});
