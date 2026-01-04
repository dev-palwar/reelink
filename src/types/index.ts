export interface ReelCardProps {
  id: number;
  title: string;
  name?: string;
  original_title: string;
  backdrop_path: string;
  first_air_date?: string;
  media_type: string;
  release_date?: string;
  poster_path: string;
}

export interface MovieData {
  id: number;
  title: string;
  original_title: string;
  backdrop_path: string;
  release_date: string;
  poster_path: string;
  first_air_date?: string;
  media_type: string;
  vote_average: number;
  genres: {
    id: number;
    name: string;
  }[];
  overview: string;
  runtime: number;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
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
  tagline: string;
  imdb_id: string;
  original_language: string;
}
