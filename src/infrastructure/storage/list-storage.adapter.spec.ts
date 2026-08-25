import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listStoragePort } from './list-storage.adapter';

const STORAGE_KEY = 'cineteca:lists';

describe('listStoragePort', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('empieza vacío cuando no hay listas guardadas', () => {
    expect(listStoragePort.getLists()).toEqual([]);
  });

  it('crea una lista y la devuelve con id y fecha de creación', () => {
    const created = listStoragePort.createList({
      name: 'Clásicos',
      description: 'Para volver a ver',
    });

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(listStoragePort.getLists()).toEqual([created]);
  });

  it('getList encuentra una lista por id', () => {
    const created = listStoragePort.createList({ name: 'Clásicos', description: '' });
    expect(listStoragePort.getList(created.id)).toEqual(created);
  });

  it('getList devuelve undefined si el id no existe', () => {
    expect(listStoragePort.getList('no-existe')).toBeUndefined();
  });

  it('actualiza el nombre y la descripción de una lista existente', () => {
    const created = listStoragePort.createList({ name: 'Clásicos', description: '' });
    listStoragePort.updateList(created.id, {
      name: 'Clásicos del cine',
      description: 'Actualizada',
    });

    expect(listStoragePort.getList(created.id)).toEqual({
      ...created,
      name: 'Clásicos del cine',
      description: 'Actualizada',
    });
  });

  it('elimina una lista', () => {
    const created = listStoragePort.createList({ name: 'Clásicos', description: '' });
    listStoragePort.deleteList(created.id);
    expect(listStoragePort.getLists()).toEqual([]);
  });

  it('descarta un JSON corrupto en localStorage sin tumbar la app', () => {
    localStorage.setItem(STORAGE_KEY, '{esto no es JSON válido');
    expect(listStoragePort.getLists()).toEqual([]);
  });

  it('descarta datos manipulados a mano que no cumplen el schema', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1, name: 42 }]));
    expect(listStoragePort.getLists()).toEqual([]);
  });
});
