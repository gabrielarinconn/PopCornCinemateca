import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListFormSchema, type ListFormValues } from '@/application/ports/list-storage.port';
import { Button } from '@/presentation/components/ui/Button';

export interface ListFormProps {
  defaultValues?: ListFormValues;
  existingNames: string[];
  isSubmitting: boolean;
  onSubmit: (values: ListFormValues) => void;
  submitLabel: string;
}

const DEFAULT_VALUES: ListFormValues = { name: '', description: '' };

export function ListForm({
  defaultValues,
  existingNames,
  isSubmitting,
  onSubmit,
  submitLabel,
}: ListFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ListFormValues>({
    resolver: zodResolver(ListFormSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  const submit = handleSubmit((values) => {
    const normalizedName = values.name.trim().toLowerCase();
    const isDuplicate = existingNames.some((name) => name.trim().toLowerCase() === normalizedName);

    if (isDuplicate) {
      setError('name', { type: 'duplicate', message: 'Ya existe una lista con este nombre.' });
      setFocus('name');
      return;
    }

    onSubmit(values);
  });

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label htmlFor="list-name" className="block text-sm font-medium text-text-primary">
          Nombre
        </label>
        <input
          id="list-name"
          type="text"
          {...register('name')}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'list-name-error' : undefined}
          className="w-full rounded-lg border border-border-subtle bg-background-surface px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
        />
        {errors.name && (
          <p id="list-name-error" role="alert" className="text-sm text-danger">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="list-description" className="block text-sm font-medium text-text-primary">
          Descripción <span className="text-text-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="list-description"
          rows={3}
          {...register('description')}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? 'list-description-error' : undefined}
          className="w-full rounded-lg border border-border-subtle bg-background-surface px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
        />
        {errors.description && (
          <p id="list-description-error" role="alert" className="text-sm text-danger">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
