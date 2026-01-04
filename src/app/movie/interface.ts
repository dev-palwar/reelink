export interface DiscoverMoviesData {
  id: number;
  adult: boolean;
  runtime: number;
  title: string;
  original_title: string;
  backdrop_path: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  imdb_id: string;
  original_language: string;
  overview: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
    english_name: string;
  }[];
  status: string;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  genres: {
    id: number;
    name: string;
  }[];
}

export interface SimilarMovieData {
  page: number;
  results: {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    popularity: number;
    backdrop_path: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
  }[];
  total_pages: number;
  total_results: number;
}

export interface MovieCreditData {
  id: number;
  cast: {
    id: number;
    name: string;
    profile_path: string;
  }[];
  crew: {
    id: number;
    name: string;
    profile_path: string;
  }[];
}
