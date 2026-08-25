# PopCorn Cinemateca 🎬
> Tu ventana al fascinante mundo del cine y la televisión.

![Banner de Bienvenida](placeholder-baner-image-url.png)

![React Badge](https://img.shields.io/badge/React-19-blue.svg) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-4.5-blue.svg) ![Vite Badge](https://img.shields.io/badge/Vite-2.6-blue.svg) ![TanStack Query Badge](https://img.shields.io/badge/TanStack%20Query-4.6-blue.svg) ![Clean Architecture Badge](https://img.shields.io/badge/Clean%20Architecture-1.0-orange.svg) ![Coverage Badge](https://img.shields.io/badge/Coverage%20-100%25-brightgreen.svg) ![License Badge](https://img.shields.io/badge/License-MIT-green.svg)

## 🍿 ¿Qué es PopCorn Cinemateca?
PopCorn Cinemateca es la solución definitiva para los entusiastas del entretenimiento. Ofrece una experiencia fluida, permitiendo a los usuarios navegar, descubrir y compartir contenido cinematográfico con facilidad y placer.

### **El Problema:**
Demasiada información dispersa y difícil acceso a contenido de calidad sin un sistema efectivo de filtrado y personalización.

### **Nuestra Solución:**
Una plataforma integral que combina un potente sistema de búsqueda, con funcionalidades avanzadas de filtrado y persistencia de datos, mejorando así la experiencia del usuario.

## ✨ Diferenciadores Clave & Experiencia de Usuario
| Característica                | Beneficio                                      |
|-------------------------------|------------------------------------------------|
| **Filtros en URL**           | Filtros avanzados para un acceso rápido.      |
| **Validación en Bordes**     | Asegura que los datos sean correctos y precisos.  |
| **4 Estados por Pantalla**    | Mejora de la Usabilidad y UX.                 |
| **Accesibilidad A11y**        | Cumple con estándares de accesibilidad.        |
| **Internacionalización**      | Soporta múltiples idiomas (ES/EN/DE).         |

## 🔄 Diagrama de Flujo de la Aplicación
```mermaid
graph TD
    User[Usuario]:::user -->|Inicia| Start[Inicio]
    Start -->|Carga| Load[Datos Iniciales]
    Load -->|Llama a| API[API TMDB]
    API -->|Responde| Validate[Validación de Datos]
    Validate -->|Datos Validados| Cache[Almacenamiento en Caché]:::cache
    Cache -->|Actualiza| Display[Mostrar Contenido]
    Display -->|Interacción| UserActions[Acciones del Usuario]
    UserActions -->|Filtra| Filter[Filtrar Contenido]
    UserActions -->|Comparte| Share[Compartir]
    UserActions -->|Accede a| Favorites[Favoritos]

    classDef user fill:#e0f7fa,stroke:#00838f,stroke-width:2px,rx:5px,ry:5px;
    classDef cache fill:#ffe0b2,stroke:#e65100,stroke-width:2px,rx:5px,ry:5px;
```

## 🏛️ Arquitectura del Sistema
La Arquitectura Limpia garantiza que el sistema sea fácil de entender, probar y mantener. Separa las responsabilidades en capas distintas, lo que permite una evolución eficaz.

```mermaid
graph TB
    %% Arquitectura Limpia
    classDef domain fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,rx:5px,ry:5px;
    classDef application fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,rx:5px,ry:5px;
    classDef infrastructure fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,rx:5px,ry:5px;
    classDef presentation fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,rx:5px,ry:5px;

    DL[Layer de Dominio: TypeScript Puro]:::domain
    AL[Layer de Aplicación: Puertos y Casos de Uso]:::application
    IL[Layer de Infraestructura: Implementaciones]:::infrastructure
    PL[Layer de Presentación: React & Tailwind]:::presentation

    %% Flujo de interacciones
    User -->|Interacción| AL
    AL -->|Solicita| DL
    AL -->|Gestiona| IL
    AL -->|Renderiza| PL

    classDef user fill:#e0f7fa,stroke:#00838f,stroke-width:2px,rx:5px,ry:5px;
```

## 🛠️ Tech Stack & Métricas de Calidad
- **React**: Para una interfaz de usuario rápida y reactiva.
- **TypeScript**: Mejora la calidad del código y evita errores comunes.
- **TanStack Query**: Para manejar la sincronización y almacenamiento en caché de datos.
- **Zod**: Validación de esquemas para asegurar la integridad de los datos.
- **Tailwind CSS**: Para un estilo moderno y adaptativo.

### Métricas Clave:
- **100% Cobertura de Dominio**
- **80% Cobertura General**
- **Sin Errores no Manejados**
- **A11y con Zoom 200%** 

## 🚀 Guía de Inicio Rápido
1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```
2. **Accede al directorio:**
   ```bash
   cd PopCornCinemateca
   ```
3. **Instala las dependencias:**
   ```bash
   npm install
   ```
4. **Configura tus variables de entorno en `.env`:**
   ```plaintext
   TMDB_API_KEY=<tu_api_key>
   ```
5. **Inicia la aplicación:**
   ```bash
   npm run dev
   ```
6. **Ejecuta pruebas:**
   ```bash
   npm run test -- --coverage
   ```

## Criterios de Éxito & Demostración de Capacidades
- [ ] Resiliencia a fallos.
- [ ] Funcionalidad de compartir URL.
- [ ] Navegación por teclado total.
- [ ] Accesibilidad y usabilidad garantizadas.

## 📄 Atribución & Licencia
- Agradecimientos a la API de [TMDB](https://www.themoviedb.org/documentation/api).
- Licencia: MIT.

Con PopCornCinemateca, ¡el entretenimiento está a solo un clic de distancia!  
¡Explora, comparte y disfruta del fascinante mundo del cine!