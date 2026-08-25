import { z } from 'zod';

/**
 * El mismo schema valida y tipa el formulario (React Hook Form) y la forma
 * que se guarda — no hay una versión "de formulario" y otra "de dominio"
 * que puedan desincronizarse.
 */
export const ListFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre no puede estar vacío.')
    .max(60, 'El nombre es demasiado largo — máximo 60 caracteres.'),
  description: z
    .string()
    .trim()
    .max(280, 'La descripción es demasiado larga — máximo 280 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type ListFormValues = z.infer<typeof ListFormSchema>;

export interface MovieList extends ListFormValues {
  id: string;
  createdAt: string;
}

/**
 * "Algo que guarda las listas locales del usuario" — reutiliza el mismo
 * almacenamiento local que la biblioteca (issue #11), bajo otra clave.
 */
export interface ListStoragePort {
  getLists(): MovieList[];
  getList(id: string): MovieList | undefined;
  createList(input: ListFormValues): MovieList;
  updateList(id: string, input: ListFormValues): void;
  deleteList(id: string): void;
}
