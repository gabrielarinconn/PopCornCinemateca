export interface PosterCardData {
  id: string;
  title: string;
  meta: string;
  imageUrl: string;
  rating?: number;
  badge?: string;
  href?: string;
}

export interface FeaturedBannerData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  rating?: number;
  watermark?: string;
}

export interface ContinueWatchingData {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  timeRemaining: string;
  imageUrl: string;
  href?: string;
}

export interface RankedFeatureData {
  id: string;
  rank: number;
  title: string;
  description?: string;
  meta?: string;
  imageUrl: string;
  badge?: string;
  rating?: number;
  watermark?: string;
  simple?: boolean;
}

export interface SeriesFilterOption {
  value: string;
  label: string;
}
