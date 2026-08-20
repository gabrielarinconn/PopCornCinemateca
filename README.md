# Cineteca

App web de descubrimiento de cine y biblioteca personal, cliente puro de la API de TMDB.

Ver [`Cineteca.md`](./Cineteca.md) (guía de producto) y [`Cinética BaseLine.md`](./Cinética%20BaseLine.md) (guía técnica de arranque) para el contexto completo.

## Estructura del proyecto

Clean Architecture. La regla de dependencia (las capas de fuera dependen de las de dentro, nunca al revés) la impone el linter, no solo este documento.

```
src/
├── domain/                    # TypeScript puro. Cero imports de React, Axios o la caché.
│   └── shared/                 # Entidades, estados, políticas, schemas, formateadores, errores.
├── application/                # Casos de uso y puertos.
│   └── ports/                  # Interfaces ("algo que trae películas", "algo que guarda la biblioteca").
├── infrastructure/              # Implementa los puertos.
│   ├── http/                   # Cliente HTTP e interceptores. Único directorio que puede importar axios.
│   ├── api/                    # Un módulo por recurso de TMDB, valida lo que llega.
│   └── storage/                # Adaptador del almacenamiento del navegador.
├── presentation/                # React y solo React.
│   ├── routes/                  # Rutas y layouts.
│   ├── components/
│   │   ├── ui/                  # Componentes de interfaz genéricos.
│   │   └── feature/             # Componentes propios de una funcionalidad.
│   ├── hooks/                   # Hooks de datos y de UI.
│   ├── providers/                # Proveedores (caché de datos, límite de errores).
│   ├── copy/                     # Todo texto visible por el usuario. Ninguna cadena suelta en un componente.
│   └── lib/                      # Utilidades de presentación (p. ej. `cn`).
├── config/                      # Configuración validada (variables de entorno).
└── test/
    └── msw/                     # Simulaciones de red para las pruebas.
```

**Regla de bolsillo:** si un archivo de `domain/` necesitara instalar algo para funcionar, está en la carpeta equivocada.

| Lo que están escribiendo                                     | Va en                     |
| ------------------------------------------------------------ | ------------------------- |
| Una regla de negocio, un estado, un formateador              | `domain/`                 |
| La interfaz de "algo que trae datos" o "algo que los guarda" | `application/ports/`      |
| La llamada a la red con su validación                        | `infrastructure/api/`     |
| El cliente HTTP y sus interceptores                          | `infrastructure/http/`    |
| El acceso al almacenamiento del navegador                    | `infrastructure/storage/` |
| Un hook de datos, un componente, una ruta                    | `presentation/`           |
| Un texto visible por el usuario                              | `presentation/copy/`      |

## Flujo de ramas

- **`main`** — protegida. Solo recibe cambios por Pull Request, con al menos una aprobación de otra persona (GitHub no permite auto-aprobar) y el gate de CI en verde. Sin _push_ directo ni _force-push_.
- **`develop`** — rama de integración. Mismas reglas de PR + CI antes de fusionar.
- **`feature/*`** — una rama por tarea o por día del plan, creada desde `develop`. Se cierra con un Pull Request hacia `develop`.

## El gate

Nada entra a `main` sin pasar `bash scripts/verify.sh --full` (formato, lint, tipos, pruebas con cobertura y build). Es el mismo script en local y en CI.

---

_Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB._
