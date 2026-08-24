export interface PosterCardData {
  id: string;
  title: string;
  meta: string;
  imageUrl: string;
  rating?: number | undefined;
  badge?: string | undefined;
  href?: string | undefined;
}

export interface FeaturedBannerData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge?: string | undefined;
  rating?: number | undefined;
  watermark?: string | undefined;
}

export interface ContinueWatchingData {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  timeRemaining: string;
  imageUrl: string;
  href?: string | undefined;
}

export interface RankedFeatureData {
  id: string;
  rank: number;
  title: string;
  description?: string | undefined;
  meta?: string | undefined;
  imageUrl: string;
  badge?: string | undefined;
  rating?: number | undefined;
  watermark?: string | undefined;
  simple?: boolean | undefined;
}

export interface SeriesFilterOption {
  value: string;
  label: string;
}
