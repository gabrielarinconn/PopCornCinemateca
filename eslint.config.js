import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  { ignores: ['dist', 'coverage'] },

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // eslint-plugin-react-hooks@7.1.1 publica configs['recommended-latest'] con
  // `plugins: ['react-hooks']` (formato eslintrc, array de strings) en vez del
  // objeto que exige flat config — es un bug real del paquete en esta versión,
  // no algo nuestro. Se reconstruye a mano: mismas reglas, plugin correcto.
  { plugins: { 'react-hooks': reactHooks }, rules: reactHooks.configs['recommended-latest'].rules },
  jsxA11y.flatConfigs.recommended,
  query.configs['flat/recommended'],

  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // ── LA REGLA DE DEPENDENCIA ───────────────────────────────────────────
  // El dominio es TypeScript puro: no conoce React, ni la librería HTTP, ni
  // la caché, ni las capas de fuera. Eso es lo que lo vuelve testeable sin
  // un solo doble de prueba.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'axios', '@tanstack/*', 'react-hook-form'],
              message: 'El dominio no depende de frameworks.',
            },
            {
              group: ['@/presentation/*', '@/infrastructure/*', '@/application/*'],
              message: 'Las dependencias apuntan hacia dentro.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/presentation/*', '@/infrastructure/*'],
              message:
                'La aplicación define interfaces; la infraestructura las implementa, no al revés.',
            },
            {
              group: ['axios', 'react', 'react-*'],
              message: 'La aplicación no sabe cómo viajan los datos.',
            },
          ],
        },
      ],
    },
  },
  // La librería HTTP existe en UN solo directorio. Si aparece en otro, el
  // transporte dejó de ser sustituible.
  // `domain/` y `application/` quedan afuera a propósito: ya prohíben axios
  // dentro de su propia regla más arriba, y en flat config dos bloques que
  // configuran la MISMA regla para el mismo archivo no se combinan — el que
  // aparece después reemplaza por completo al anterior, no lo complementa.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/infrastructure/http/**', 'src/domain/**', 'src/application/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'axios', message: 'Solo src/infrastructure/http puede importar axios.' }],
        },
      ],
    },
  },

  { files: ['**/*.spec.{ts,tsx}'], rules: { '@typescript-eslint/no-non-null-assertion': 'off' } },
  // Stubs vacíos de APIs del navegador que jsdom no implementa (ResizeObserver) —
  // vacíos a propósito, no un olvido.
  { files: ['vitest.setup.ts'], rules: { '@typescript-eslint/no-empty-function': 'off' } },
  // eslint-plugin-jsx-a11y no publica tipos para `flatConfigs`, así que TypeScript
  // lo ve como `any` — es un hueco de tipos del paquete, no algo inseguro que
  // escribimos nosotros.
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  prettier, // último siempre: apaga lo que Prettier decide
);
