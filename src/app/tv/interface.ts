export interface TVData {
  id: number;
  adult: boolean;
  name: string;
  original_name: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
  number_of_episodes: number;
  number_of_seasons: number;
  in_production: boolean;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    runtime: number;
    season_number: number;
    vote_average: number;
  }[];
  overview: string;
  genres: {
    id: number;
    name: string;
  }[];
  seasons: {
    id: number;
    name: string;
  }[];
  networks: {
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
  runtime: number;
  first_air_date: string;
  last_air_date: string;
  episode_run_time: number[];
  languages: string[];
}
