# PopCornCinemateca

## Introducción
PopCornCinemateca es una plataforma de vanguardia diseñada para los entusiastas del cine y la televisión. Esta aplicación permite a los usuarios descubrir, explorar y compartir una vasta colección de películas y programas de televisión, aprovechando una API confiable y bien documentada. Con un enfoque en la experiencia del usuario, buscamos transformar la forma en que accedes y disfrutas del contenido audiovisual.

## Características Principales
- **Búsqueda Eficaz**: Encuentra rápidamente películas y programas usando nuestra interfaz intuitiva.
- **Filtros Avanzados**: Personaliza tu búsqueda mediante filtros que te permiten encontrar exactamente lo que deseas.
- **Función de Compartir**: Comparte fácilmente enlaces a películas y programas con amigos y familiares.
- **Favoritos**: Guarda tus títulos preferidos y accede a ellos de manera instantánea.

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
Para comenzar a disfrutar de PopCornCinemateca:
1. **Clona el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   ```
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Inicia la aplicación**:
   ```bash
   npm start
   ```

## Preguntas Frecuentes (FAQs)
**¿Es PopCornCinemateca gratuita?**  
Sí, puedes acceder a todas las funcionalidades sin costo alguno.  

**¿Qué tipo de contenido puedo encontrar?**  
Ofrecemos una amplia variedad de películas y programas de televisión de diferentes géneros y épocas.  

## Contacto
Si tienes alguna pregunta o necesitas asistencia técnica, no dudes en contactar:
- **Email**: soporte@popcorncinemateca.com

¡Explora y disfruta del fascinante mundo del cine con PopCornCinemateca!