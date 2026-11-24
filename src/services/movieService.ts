import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieSearchResponse {
  results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const { data } = await axios.get<MovieSearchResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query, include_adult: false },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );

  return data.results;
}
