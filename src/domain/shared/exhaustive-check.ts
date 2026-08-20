/**
 * Se llama desde el `default` de un `switch` sobre una unión discriminada.
 * Si mañana se agrega una variante nueva y no se maneja en algún switch,
 * TypeScript deja de compilar exactamente en esa línea — `value` deja de
 * poder asignarse a `never`.
 */
export function assertUnreachable(value: never): never {
  throw new Error(`Caso no manejado: ${JSON.stringify(value)}`);
}
