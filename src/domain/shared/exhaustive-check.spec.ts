import { describe, expect, it } from 'vitest';
import { assertUnreachable } from './exhaustive-check';

describe('assertUnreachable', () => {
  it('lanza un error con el valor no manejado', () => {
    // @ts-expect-error — a propósito: se prueba el caso "imposible" en tiempo de ejecución.
    expect(() => assertUnreachable({ kind: 'inventado' })).toThrow('Caso no manejado');
  });
});
