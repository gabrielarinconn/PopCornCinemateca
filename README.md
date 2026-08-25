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