# PopCornCinemateca

## Introducción
PopCornCinemateca es una innovadora aplicación diseñada para los apasionados del cine. Con nuestra plataforma, los usuarios pueden explorar, filtrar y compartir información sobre una amplia variedad de películas y programas de televisión. Utilizamos una API robusta para ofrecer contenido actualizado y relevante, brindando a los usuarios una experiencia impecable y atractiva.

## Características Principales
- **Exploración Eficiente**: Busca y descubre películas y programas de manera fácil y rápida.
- **Filtros Personalizables**: Aplica filtros avanzados para encontrar contenido adaptado a tus preferencias.
- **Interacción Social**: Comparte tus descubrimientos con amigos y familiares de forma sencilla.
- **Acceso a Favoritos**: Guarda tus películas y programas preferidos para acceder a ellos en cualquier momento.

## Diagrama de Cómo Funciona la App
```mermaid
flowchart TD
    User[Usuario]:::user -->|Accede a la aplicación| Start[Inicio]
    Start -->|Carga de datos| Load[Load Data]
    Load -->|Llama a la API| API[API TMDB]
    API -->|Devuelve datos| Validate[Validación]
    Validate -->|Datos validados| Cache[Cache]:::cache
    Cache -->|Datos actualizados| Display[Mostrar Datos]
    Display -->|Interacción del usuario| UserActions[Acciones del Usuario]
    UserActions -->|Aplica filtros| Filter[Filtrar Datos]
    UserActions -->|Comparte| Share[Compartir]
    UserActions -->|Accede a favoritos| Favorites[Favoritos]

    classDef user fill:#e0f7fa,stroke:#00838f,stroke-width:2px,rx:5px,ry:5px;
    classDef cache fill:#ffe0b2,stroke:#e65100,stroke-width:2px,rx:5px,ry:5px;
```

## Diagrama de Arquitectura
```mermaid
flowchart TB
    %% === ARQUITECTURA DE LA APLICACIÓN ===
    classDef domain fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,rx:5px,ry:5px
    classDef application fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,rx:5px,ry:5px
    classDef infrastructure fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,rx:5px,ry:5px
    classDef presentation fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:5px,ry:5px

    %% Capa de Dominio
    DL[Layer de Dominio: TypeScript Puro]:::domain

    %% Capa de Aplicación
    AL[Layer de Aplicación: Puertos y Casos de Uso]:::application

    %% Capa de Infraestructura
    IL[Layer de Infraestructura: Implementaciones]:::infrastructure

    %% Capa de Presentación
    PL[Layer de Presentación: React & Tailwind]:::presentation

    %% Flujo de interacciones
    User -->|Realiza| AL
    AL -->|Llama a| DL
    AL -->|Implementa| IL
    AL -->|Renderiza| PL

    classDef user fill:#e0f7fa,stroke:#00838f,stroke-width:2px,rx:5px,ry:5px;
```

## Instrucciones de Uso
Para comenzar a disfrutar de PopCornCinemateca, sigue estos pasos:
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```

## Contacto
Si tienes preguntas o necesitas soporte, no dudes en contactarnos a:
- **Email**: soporte@popcorncinemateca.com

¡Explora y disfruta del fascinante mundo del cine con PopCornCinemateca!