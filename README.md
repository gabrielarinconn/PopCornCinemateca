# PopCornCinemateca

## Introducción
PopCornCinemateca es una aplicación diseñada para que los amantes del cine puedan explorar, filtrar y compartir información sobre películas y programas de televisión. Nuestra plataforma utiliza una API robusta para ofrecer datos actualizados, permitiendo una experiencia de usuario fluida y atractiva.

## Características Principales
- **Explora**: Busca películas y programas de televisión fácilmente.
- **Filtra**: Aplicar filtros para encontrar exactamente lo que buscas.
- **Comparte**: Comparte enlaces a tus películas favoritas con amigos.
- **Favoritos**: Guarda tus películas y programas de televisión preferidos para fácil acceso.

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
Para empezar, solo sigue estos pasos:
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```

## Contacto
Para más información, preguntas o soporte, contáctanos a:
- **Email**: soporte@popcorncinemateca.com

Disfruta explorando el mundo del cine con PopCornCinemateca!