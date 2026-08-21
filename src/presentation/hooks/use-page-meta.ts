import { useEffect, useRef } from 'react';

/**
 * Al entrar a una ruta, el `<title>` del documento cambia y el foco va al
 * encabezado de la pantalla — sin esto, un lector de pantalla se queda
 * leyendo la página anterior.
 */
export function usePageMeta(title: string) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title;
    headingRef.current?.focus();
  }, [title]);

  return headingRef;
}
