# PopCorn Cinemateca

## Discover, organize and share movies like never before

**A modern web app for movie lovers who want to discover new films, build their personal library and share their discoveries via direct links.**

```mermaid
flowchart TB
    %% === CLEAN ARCHITECTURE LAYERS ===
    classDef domain fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,rx:5px,ry:5px
    classDef application fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,rx:5px,ry:5px
    classDef infrastructure fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,rx:5px,ry:5px
    classDef presentation fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:5px,ry:5px

    %% Domain Layer (pure TS, no deps)
    DL[Domain Layer<br/>(Pure TypeScript)<br/>&nbsp;&nbsp;• Entities & Enums<br/>&nbsp;&nbsp;• Discriminated Unions<br/>&nbsp;&nbsp;• Validation Schemas<br/>&nbsp;&nbsp;• Business Rules]<br/>:::domain

    %% Application Layer (ports & use cases)
    AL[Application Layer<br/>(Ports & Use Cases)<br/>&nbsp;&nbsp;• GetMovies Use Case<br/>&nbsp;&nbsp;• Filter Movies<br/>&nbsp;&nbsp;• Save to Library]<br/>:::application

    %% Infrastructure Layer (implementations)
    IL[Infrastructure Layer<br/>(Implementations)<br/>&nbsp;&nbsp;• HTTP Client<br/>&nbsp;&nbsp;• TMDB API Adapter<br/>&nbsp;&nbsp;• LocalStorage Adapter]<br/>:::infrastructure

    %% Presentation Layer (React UI)
    PL[Presentation Layer<br/>(React & Tailwind)<br/>&nbsp;&nbsp;• Routes<br/>&nbsp;&nbsp;• Components<br/>&nbsp;&nbsp;• Hooks<br/>&nbsp;&nbsp;• State Management]<br/>:::presentation

    %% === DATA FLOW ===
    TMDB[TMDB API<br/>🌐 https://api.themoviedb.org/3]<br/>&nbsp;&nbsp;• 7 Endpoints<br/>&nbsp;&nbsp;• Pagination ≤500 pages<br/>&nbsp;&nbsp;• Rate Limit: 50/s]

    Validation[Validation Layer<br/>🛡️ Zod Schemas<br/>&nbsp;&nbsp;• Response validation<br/>&nbsp;&nbsp;• Type-safe data<br/>&nbsp;&nbsp;• Border protection]

    Cache[TanStack Query Cache<br/>⚡ Infinite Pagination<br/>&nbsp;&nbsp;• Automatic Revalidation<br/>&nbsp;&nbsp;• Stale-while-revalidated<br/>&nbsp;&nbsp;• optimistic updates]

    MSW[MSW Simulations<br/>🧪 Network Edge Cases<br/>&nbsp;&nbsp;• 429 Rate Limiting<br/>&nbsp;&nbsp;• 404/400 TMDB errors<br/>&nbsp;&nbsp;• Corrupt data<br/>&nbsp;&nbsp;• Timeouts]

    LocalStorage[Local Storage<br/>💾 User Library<br/>&nbsp;&nbsp;• Persisted Favorites<br/>&nbsp;&nbsp;• Validation on read<br/>&nbsp;&nbsp;• Auto-revert on write fail]

    %% Connections - Data Flow
    TMDB -->|Raw Responses| Validation
    Validation -->|Validated Data| Cache
    Cache -->|Optimistic Updates| PL
    PL -->|User Actions| MSW
    MSW -->|Simulated Network| Validation
    Validation -->|Filtered Data| Cache
    Cache -->|Cached Data| PL
    
    %% User Flow
    User[User<br/>&nbsp;&nbsp;• Access app<br/>&nbsp;&nbsp;• Apply filters<br/>&nbsp;&nbsp;• Share links]:::domain
    Share[Shareable URL<br/>• Filters encoded<br/>• State reproducible]:::application

    User -->|Navigates & Filters| Share
    Share -->|Reproduces Exact View| User

    %% Four States per Screen
    StateLoading[Screen States<br/>&nbsp;&nbsp;• #1 Loading: Skeletons<br/>&nbsp;&nbsp;• #2 Error: Friendly message + Retry<br/>&nbsp;&nbsp;• #3 Empty Initial: "Explore movies" call-to-action<br/>&nbsp;&nbsp;• #4 Empty Filter: "No movies match" + Clear filters]

    %% Three Borders Validation
    Borders[Three Borders Validation<br/>&nbsp;&nbsp;🔒 Network<br/>&nbsp;&nbsp;💾 Local Storage<br/>&nbsp;&nbsp;🔗 URL Parameters]

    %% Connections
    PL -->|Renders| User
    User -->|Local Storage Actions| LocalStorage
    LocalStorage -->|Validated Reads| Borders
    Borders -->|Graceful Falls| PL

    %% Style assignments
    class DL,AL,IL,PL domain application infrastructure presentation

    %% Subgraph grouping
    subgraph CleanArch["Clean Architecture"]
        direction TB
        DL -->|Uses Interfaces| AL
        AL -->|Implements| IL
        IL -->|Calls| TMDB
    end

    style CleanArch fill:#transparent,stroke:none

    %% Diagram title area
    class User,Share,StateLoading,Borders,Borders fill:#e0f7fa,stroke:#00838f,stroke-width:1px,rx:3px,ry:3px
```

### The Problem We Solve

Current streaming platforms are passive: they show the same thing to everyone. There's no personalized way to discover, organize and share the cinematic content that truly matters to each user.

### Our Solution

PopCorn Cinemateca is an intuitive and fast web app that:

- **Intelligent discovery**: Filter the catalog by genre, year, rating and votes
- **Personal library**: Save your favorite movies in the browser with robust validation
- **Shareable links**: Share exactly what you're watching via reproducible URLs
- **Multi-platform experience**: Works in Spanish, English and German without breaking the design

### Key Differentiators

| Feature | User Benefit |
|---|---|
| **URL filters** | Share or reproduce the exact same filtering on any device |
| **Four states per screen** | Loading, error, initial empty and empty by filter — each designed for UX |
| **Validation across three borders** | Network, local storage and URL always validated — the app never silently fails |
| **Optimized resources** | Correctly sized posters, virtualization of thousands of cards, smooth scrolling |
| **Full accessibility** | Keyboard navigation, screen readers, sufficient contrast, 200% zoom |

### Architecture That Inspires Confidence

Built with **Clean Architecture** principles:

- **Domain Layer**: Pure TypeScript, no React or Axios dependencies — 100% testable
- **Application Layer**: Ports and use cases — business logic is isolated
- **Infrastructure Layer**: Implements the ports — HTTP, API, local storage
- **Presentation Layer**: React and Tailwind — the user interface your users love

### Technology Stack

- **Vite** + **React 19** + **React Router 8** for exceptional performance
- **TanStack Query** for intelligent caching, revalidation and infinite pagination
- **Zod** for validation across the entire stack — the schema is the type
- **Tailwind CSS 4** with semantic tokens — consistent design without configuration files
- **MSW** for network edge case testing

### Success Criteria

At the end of the project, the team must demonstrate:

1. Explore the catalog with filters among thousands of results, with shareable links
2. Open a movie card where unknown budgets show "no data", no fake values
3. Save and organize their library with instant updates and automatic revert on failure
4. Test corrupt or invented data in the URL or storage without breaking the app
5. Use the entire keyboard — complete navigation, visible focus, 200% zoom without cuts
6. Another person opens the deployed URL and uses it without intervention

### Attribution and License

This product uses the TMDB API but is not endorsed or certified by TMDB. TMDB attribution is mandatory per terms of use and shown in the footer from day one.

### For Stakeholders

**Delivered in 7 days:**
- Fully functional app with professional architecture
- Code with 100% domain coverage
- Quality gate green locally and in CI
- README that a stranger can follow to get the app running

**The real value isn't the app:** it's the criterion for consuming any API with head — validating every edge, treating cache as an expiring copy, modeling impossible states outside the type, not letting a gap pass as data.

*Ideal for development teams who want to learn robust architecture while delivering a tangible, usable product.*

---

Current streaming platforms are passive: they show the same thing to everyone. There's no personalized way to discover, organize and share the cinematic content that truly matters to each user.

### Our Solution

PopCorn Cinemateca is an intuitive and fast web app that:

- **Intelligent discovery**: Filter the catalog by genre, year, rating and votes
- **Personal library**: Save your favorite movies in the browser with robust validation
- **Shareable links**: Share exactly what you're watching via reproducible URLs
- **Multi-platform experience**: Works in Spanish, English and German without breaking the design

### Key Differentiators

| Feature | User Benefit |
|---|---|
| **URL filters** | Share or reproduce the exact same filtering on any device |
| **Four states per screen** | Loading, error, initial empty and empty by filter — each designed for UX |
| **Validation across three borders** | Network, local storage and URL always validated — the app never silently fails |
| **Optimized resources** | Correctly sized posters, virtualization of thousands of cards, smooth scrolling |
| **Full accessibility** | Keyboard navigation, screen readers, sufficient contrast, 200% zoom |

### Architecture That Inspires Confidence

Built with **Clean Architecture** principles:

- **Domain Layer**: Pure TypeScript, no React or Axios dependencies — 100% testable
- **Application Layer**: Ports and use cases — business logic is isolated
- **Infrastructure Layer**: Implements the ports — HTTP, API, local storage
- **Presentation Layer**: React and Tailwind — the user interface your users love

### Technology Stack

- **Vite** + **React 19** + **React Router 8** for exceptional performance
- **TanStack Query** for intelligent caching, revalidation and infinite pagination
- **Zod** for validation across the entire stack — the schema is the type
- **Tailwind CSS 4** with semantic tokens — consistent design without configuration files
- **MSW** for network edge case testing

### Success Criteria

At the end of the project, the team must demonstrate:

1. Explore the catalog with filters among thousands of results, with shareable links
2. Open a movie card where unknown budgets show "no data", no fake values
3. Save and organize their library with instant updates and automatic revert on failure
4. Test corrupt or invented data in the URL or storage without breaking the app
5. Use the entire keyboard — complete navigation, visible focus, 200% zoom without cuts
6. Another person opens the deployed URL and uses it without intervention

### Attribution and License

This product uses the TMDB API but is not endorsed or certified by TMDB. TMDB attribution is mandatory per terms of use and shown in the footer from day one.

### For Stakeholders

**Delivered in 7 days:**
- Fully functional app with professional architecture
- Code with 100% domain coverage
- Quality gate green locally and in CI
- README that a stranger can follow to get the app running

**The real value isn't the app:** it's the criterion for consuming any API with head — validating every edge, treating cache as an expiring copy, modeling impossible states outside the type, not letting a gap pass as data.

*Ideal for development teams who want to learn robust architecture while delivering a tangible, usable product.*

---

# PopCorn Cinemateca

## Descubre, organiza y comparte cine como nunca antes

**Una aplicación web moderna para los amantes del cine** que desean descubrir nuevas películas, construir su biblioteca personal y compartir sus descubrimientos mediante enlaces directos.

```mermaid
flowchart TB
    %% === CAPAS DE ARQUITECTURA LIMPIA ===
    classDef domain fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,rx:5px,ry:5px
    classDef application fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,rx:5px,ry:5px
    classDef infrastructure fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,rx:5px,ry:5px
    classDef presentation fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:5px,ry:5px

    %% Layer de dominio (TS puro, sin dependencias)
    DL[Layer de Dominio<br/>(TypeScript Puro)<br/>&nbsp;&nbsp;• Entidades y Enumerações<br/>&nbsp;&nbsp;• Uniones Discriminadas<br/>&nbsp;&nbsp;• Schemas de Validación<br/>&nbsp;&nbsp;• Reglas de Negocio]<br/>:::domain

    %% Layer de aplicación (puertos y casos de uso)
    AL[Layer de Aplicación<br/>(Puertos y Casos de Uso)<br/>&nbsp;&nbsp;• Caso Uso Obtener Películas<br/>&nbsp;&nbsp;• Caso Uso Filtrar<br/>&nbsp;&nbsp;• Caso Uso Guardar Biblioteca]<br/>:::application

    %% Layer de infraestructura (implementaciones)
    IL[Layer de Infraestructura<br/>(Implementaciones)<br/>&nbsp;&nbsp;• Cliente HTTP<br/>&nbsp;&nbsp;• Adaptador API TMDB<br/>&nbsp;&nbsp;• Adaptador LocalStorage]<br/>:::infrastructure

    %% Layer de presentación (React UI)
    PL[Layer de Presentación<br/>(React & Tailwind)<br/>&nbsp;&nbsp;• Rutas<br/>&nbsp;&nbsp;• Componentes<br/>&nbsp;&nbsp;• Hooks<br/>&nbsp;&nbsp;• Gestión de Estado]<br/>:::presentation

    %% === FLUJO DE DATOS ===
    TMDB[API TMDB<br/>🌐 https://api.themoviedb.org/3]<br/>&nbsp;&nbsp;• 7 Endpoints<br/>&nbsp;&nbsp;• Paginación ≤500 páginas<br/>&nbsp;&nbsp;• Límite: 50 peticiones/s]

    Validation[Layer de Validación<br/>🛡️ Schemas Zod<br/>&nbsp;&nbsp;• Validación de respuestas<br/>&nbsp;&nbsp;• Datos tipados<br/>&nbsp;&nbsp;• Protección de bordes]

    Cache[Cache TanStack Query<br/>⚡ Paginación Infinita<br/>&nbsp;&nbsp;• Revalidación Automática<br/>&nbsp;&nbsp;• Stale-while-revalidated<br/>&nbsp;&nbsp;• Mutaciones optimistas]

    MSW[Simulaciones MSW<br/>🧪 Casos Límite de Red<br/>&nbsp;&nbsp;• Límite 429<br/>&nbsp;&nbsp;• Errores 404/400 TMDB<br/>&nbsp;&nbsp;• Datos corruptos<br/>&nbsp;&nbsp;• Timeouts]

    LocalStorage[Local Storage<br/>💾 Biblioteca de Usuario<br/>&nbsp;&nbsp;• Favoritos Persistidos<br/>&nbsp;&nbsp;• Validación al leer<br/>&nbsp;&nbsp;• Reversión automática en fallo]

    %% Flujo de datos
    TMDB -->|Respuestas Crudas| Validation
    Validation -->|Datos Validados| Cache
    Cache -->|Actualizaciones Optimistas| PL
    PL -->|Acciones de Usuario| MSW
    MSW -->|Red Simulada| Validation
    Validation -->|Datos Filtrados| Cache
    Cache -->|Datos Cachés| PL

    %% Flujo de usuario
    User[Usuario<br/>&nbsp;&nbsp;• Accede a la app<br/>&nbsp;&nbsp;• Aplica filtros<br/>&nbsp;&nbsp;• Comparte enlaces]:::domain
    Share[URL Compartible<br/>• Filtros codificados<br/>• Estado reproducible]:::application

    User -->|Navega y Filtra| Share
    Share -->|Reproduce Vista Exacta| User

    %% Cuatro estados por pantalla
    StateLoading[Estados de Pantalla<br/>&nbsp;&nbsp;• #1 Cargando: Esqueletos<br/>&nbsp;&nbsp;• #2 Error: Mensaje amable + Reintentar<br/>&nbsp;&nbsp;• #3 Vacío Inicial: Llamada a "Explorar películas"<br/>&nbsp;&nbsp;• #4 Vacío por Filtro: "Ninguna película coincide" + Limpiar filtros]

    %% Validación en tres bordes
    Borders[Validación en Tres Bordes<br/>&nbsp;&nbsp;🔒 Red<br/>&nbsp;&nbsp;💾 Almacenamiento Local<br/>&nbsp;&nbsp;🔗 Parámetros URL]

    %% Conexiones
    PL -->|Renderiza| User
    User -->|Acciones en LocalStorage| LocalStorage
    LocalStorage -->|Lecturas Validadas| Borders
    Borders -->|Caídas Graceful| PL

    %% Asignación de estilos
    class DL,AL,IL,PL domain application infrastructure presentation

    %% Grupos
    subgraph CleanArch["Arquitectura Limpia"]
        direction TB
        DL -->|Usa Interfaces| AL
        AL -->|Implementa| IL
        IL -->|Consulta| TMDB
    end

    style CleanArch fill:#transparent,stroke:none

    %% Estilo común
    User,Share,StateLoading,Borders fill:#e0f7fa,stroke:#00838f,stroke-width:1px,rx:3px,ry:3px
```

### El Problema que Resolvemos

Las plataformas de streaming actuales son pasivas: te muestran lo mismo que a todos. No hay forma personalizada de descubrir, organizar y compartir el contenido cinematográfico que realmente importa para cada usuario.

### Nuestra Solución

PopCorn Cinemateca es una app web intuitiva y rápida que:

- **Descubrimiento inteligente**: Filtra el catálogo por género, año, calificación y votos
- **Biblioteca personal**: Guarda tus películas favoritas en el navegador con validación robusta
- **Compartir enlaces**: Comparte exactamente qué estás viendo mediante URLs reproducibles
- **Experiencia multiplataforma**: Funciona en español, inglés y alemán sin romper el diseño

### Diferenciadores Clave

| Característica | Beneficio para el usuario |
|---|---|
| **Filtros en la URL** | Comparte o reproduce exactamente el mismo filtrado en cualquier dispositivo |
| **Cuatro estados por pantalla** | Carga, error, vacío inicial y vacío por filtro — cada uno diseñado para UX |
| **Validación en los tres bordes** | Red, almacenamiento local y URL siempre validadas — la app nunca falla silenciosamente |
| **Recursos optimizados** | Pósters en tamaño correcto, virtualización de miles de tarjetas, scroll fluido |
| **Accesibilidad completa** | Navegación por teclado, lectores de pantalla, contraste suficiente, zoom al 200% |

### Arquitectura que Inspira Confianza

Construida con principios de **Clean Architecture**:

- **Layer de dominio**: TypeScript puro, sin dependencias de React ni Axios — 100% testeable
- **Layer de aplicación**: Puertos y casos de uso — la lógica de negocio está aislada
- **Layer de infraestructura**: Implementa los puertos — HTTP, API, almacenamiento local
- **Layer de presentación**: React y Tailwind — la interfaz de usuario que tus usuarios aman

### Pila Tecnológica

- **Vite** + **React 19** + **React Router 8** para un rendimiento excepcional
- **TanStack Query** para caché inteligente, revalidación y paginación infinita
- **Zod** para validación en todo el stack — la schema es el tipo
- **Tailwind CSS 4** con tokens semánticos — diseño consistente sin archivos de configuración
- **MSW** para pruebas de borde en la capa de red

### Criterios de Éxito

Al finalizar el proyecto, el equipo debe poder demostrar:

1. Explorar el catálogo con filtros entre miles de resultados, con enlaces compartibles
2. Abrir una ficha de película donde los presupuestos desconocidos dicen "sin dato", sin valores fingidos
3. Guardar y organizar su biblioteca con actualización instantánea y reversión automática en fallos
4. Probar datos corruptos o inventados en la URL o almacenamiento sin tumbar la aplicación
5. Usar todo el teclado — navegación completa, foco visible, zoom al 200% sin cortes
6. Que otra persona abra la URL desplegada y la use sin intervención

### Atribución y Licencia

Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB. La atribución a TMDB es obligatoria por los términos de uso y se muestra en el pie de página desde el día 1.

### Para los Stakeholders

**Entregable en 7 días:**
- App completamente funcional con arquitectura profesional
- Código con 100% de cobertura en dominio
- Gate de calidad verde en local y CI
- README que un extraño puede seguir para poner la app en marcha

**El verdadero valor no es la app:** es el criterio para consumir cualquier API con cabeza —validar cada borde, tratar la caché como una copia que caduca, modelar los estados imposibles fuera del tipo, no dejar que un hueco se disfrace de dato.

*Ideal para equipos de desarrollo que quieren aprender arquitectura robusta mientras entregan un producto tangible y usable.*

Las plataformas de streaming actuales son pasivas: te muestran lo mismo que a todos. No hay forma personalizada de descubrir, organizar y compartir el contenido cinematográfico que realmente importa para cada usuario.

### Nuestra Solución

PopCorn Cinemateca es una app web intuitiva y rápida que:

- **Descubrimiento inteligente**: Filtra el catálogo por género, año, calificación y votos
- **Biblioteca personal**: Guarda tus películas favoritas en el navegador con validación robusta
- **Compartir enlaces**: Comparte exactamente qué estás viendo mediante URLs reproducibles
- **Experiencia multiplataforma**: Funciona en español, inglés y alemán sin romper el diseño

### Diferenciadores Clave

| Característica | Beneficio para el usuario |
|---|---|
| **Filtros en la URL** | Comparte o reproduce exactamente el mismo filtrado en cualquier dispositivo |
| **Cuatro estados por pantalla** | Carga, error, vacío inicial y vacío por filtro — cada uno diseñado para UX |
| **Validación en los tres bordes** | Red, almacenamiento local y URL siempre validadas — la app nunca falla silenciosamente |
| **Recursos optimizados** | Pósters en tamaño correcto, virtualización de miles de tarjetas, scroll fluido |
| **Accesibilidad completa** | Navegación por teclado, lectores de pantalla, contraste suficiente, zoom al 200% |

### Arquitectura que Inspira Confianza

Construida con principios de **Clean Architecture**:

- **Layer de dominio**: TypeScript puro, sin dependencias de React ni Axios — 100% testeable
- **Layer de aplicación**: Puertos y casos de uso — la lógica de negocio está aislada
- **Layer de infraestructura**: Implementa los puertos — HTTP, API, almacenamiento local
- **Layer de presentación**: React y Tailwind — la interfaz de usuario que tus usuarios aman

### Pila Tecnológica

- **Vite** + **React 19** + **React Router 8** para un rendimiento excepcional
- **TanStack Query** para caché inteligente, revalidación y paginación infinita
- **Zod** para validación en todo el stack — la schema es el tipo
- **Tailwind CSS 4** con tokens semánticos — diseño consistente sin archivos de configuración
- **MSW** para pruebas de borde en la capa de red

### Criterios de Éxito

Al finalizar el proyecto, el equipo debe poder demostrar:

1. Explorar el catálogo con filtros entre miles de resultados, con enlaces compartibles
2. Abrir una ficha de película donde los presupuestos desconocidos dicen "sin dato", sin valores fingidos
3. Guardar y organizar su biblioteca con actualización instantánea y reversión automática en fallos
4. Probar datos corruptos o inventados en la URL o almacenamiento sin tumbar la aplicación
5. Usar todo el teclado — navegación completa, foco visible, zoom al 200% sin cortes
6. Que otra persona abra la URL desplegada y la use sin intervención

### Atribución y Licencia

Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB. La atribución a TMDB es obligatoria por los términos de uso y se muestra en el pie de página desde el día 1.

### Para los Stakeholders

**Entregable en 7 días:**
- App completamente funcional con arquitectura profesional
- Código con 100% de cobertura en dominio
- Gate de calidad verde en local y CI
- README que un extraño puede seguir para poner la app en marcha

**El verdadero valor no es la app:** es el criterio para consumir cualquier API con cabeza —validar cada borde, tratar la caché como una copia que caduca, modelar los estados imposibles fuera del tipo, no dejar que un hueco se disfrace de dato.

*Ideal para equipos de desarrollo que quieren aprender arquitectura robusta mientras entregan un producto tangible y usable.*