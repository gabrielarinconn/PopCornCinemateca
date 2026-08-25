/**
 * jsdom no calcula layout real — todo elemento mide 0×0. Componentes que
 * dependen de una medida real (como @tanstack/react-virtual, que lee
 * `offsetHeight`/`offsetWidth` al montar) necesitan un valor no nulo para
 * comportarse como en un navegador real.
 */
export function mockElementSize(width: number, height: number): () => void {
  const originalWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: height,
  });

  return () => {
    if (originalWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalWidth);
    if (originalHeight)
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalHeight);
  };
}
