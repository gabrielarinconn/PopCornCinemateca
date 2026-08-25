import axe from 'axe-core';

/**
 * jsdom no calcula layout ni estilos pintados de verdad, así que
 * `color-contrast` da falsos positivos/negativos — se desactiva aquí, no
 * porque no importe, sino porque esta prueba no es el lugar para verificarlo.
 */
const RULES_DISABLED_IN_JSDOM = { 'color-contrast': { enabled: false } };

export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { rules: RULES_DISABLED_IN_JSDOM });
  const relevant = results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious',
  );

  if (relevant.length > 0) {
    const details = relevant
      .map((violation) => `- [${String(violation.impact)}] ${violation.id}: ${violation.help}`)
      .join('\n');
    throw new Error(`Violaciones de accesibilidad:\n${details}`);
  }
}
