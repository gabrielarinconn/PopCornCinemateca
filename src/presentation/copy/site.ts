export const siteCopy = {
  appName: 'popCorn',
  header: {
    home: 'Inicio',
  },
  footer: {
    attribution: 'Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o se movió de lugar.',
    backHome: 'Volver al inicio',
  },
  genericError: {
    title: 'Algo salió mal. Vuelve a intentarlo.',
  },
  movieDetail: {
    loading: 'Cargando la ficha...',
    error: 'No pudimos cargar esta película.',
    retry: 'Reintentar',
    noData: 'Sin dato',
    noRatings: 'Sin valoraciones',
    fewVotesNotice: 'pocos votos',
    overviewFallbackNotice:
      'La sinopsis no está disponible en español. Mostramos la versión en inglés.',
    budgetLabel: 'Presupuesto',
    castLabel: 'Elenco',
    trailersLabel: 'Tráilers',
    recommendationsLabel: 'Recomendadas',
    watchOnYouTube: 'Ver en YouTube',
  },
  search: {
    title: 'Buscar',
    heading: 'Buscar películas',
    inputLabel: 'Buscar películas',
    placeholder: 'Escribe el título de una película...',
    loading: 'Buscando...',
    error: 'No pudimos completar la búsqueda.',
    retry: 'Reintentar',
    emptyInitialTitle: 'Busca algo para empezar',
    emptyInitialDescription: 'Escribe el título de una película para ver resultados.',
    noResultsTitle: 'Sin resultados',
    noResultsDescription: 'No encontramos películas que coincidan con tu búsqueda.',
  },
} as const;
