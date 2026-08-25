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
    DL[Domain Layer (Pure TypeScript)]
    AL[Application Layer (Ports & Use Cases)]
    IL[Infrastructure Layer (Implementations)]
    PL[Presentation Layer (React & Tailwind)]

    %% === DATA FLOW ===
    TMDB[TMDB API (https://api.themoviedb.org/3)]
    Validation[Validation Layer (Zod Schemas)]
    Cache[TanStack Query Cache (Infinite Pagination)]
    MSW[MSW Simulations (Network Edge Cases)]
    LocalStorage[Local Storage (User Library)]

    %% Connections - Data Flow
    TMDB -->|Raw Responses| Validation
    Validation -->|Validated Data| Cache
    Cache -->|Optimistic Updates| PL
    PL -->|User Actions| MSW
    MSW -->|Simulated Network| Validation
    Validation -->|Filtered Data| Cache
    Cache -->|Cached Data| PL

    %% User Flow
    User[User (Access app, Apply filters, Share links)]
    Share[Shareable URL (Filters encoded, State reproducible)]

    User -->|Navigates & Filters| Share
    Share -->|Reproduces Exact View| User

    %% Four States per Screen
    StateLoading[Screen States: (1) Loading: Skeletons, (2) Error: Friendly message + Retry, (3) Empty Initial: Explore movies call-to-action, (4) Empty Filter: No movies match + Clear filters]

    %% Three Borders Validation
    Borders[Three Borders Validation: Network, Local Storage, URL Parameters]

    %% Connections
    PL -->|Renders| User
    User -->|Local Storage Actions| LocalStorage
    LocalStorage -->|Validated Reads| Borders
    Borders -->|Graceful Falls| PL

    %% Style assignments
    class DL domain
    class AL application
    class IL infrastructure
    class PL presentation

    %% Subgraph grouping
    subgraph CleanArch["Clean Architecture"]
        direction TB
        DL -->|Uses Interfaces| AL
        AL -->|Implements| IL
        IL -->|Calls| TMDB
    end

    style CleanArch fill:#transparent,stroke:none

    %% Diagram title area
    class User,Share,StateLoading,Borders fill:#e0f7fa,stroke:#00838f,stroke-width:1px,rx:3px,ry:3px
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