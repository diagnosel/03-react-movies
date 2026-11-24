import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const latestRequest = useRef(0);

  async function handleSearch(query: string): Promise<void> {
    const requestId = ++latestRequest.current;
    setMovies([]);
    setSelectedMovie(null);
    setError(false);
    setLoading(true);
    toast.dismiss();

    try {
      const results = await fetchMovies(query);
      // A slow response must not replace a newer search.
      if (requestId !== latestRequest.current) return;

      setMovies(results);
      if (results.length === 0) {
        toast('No movies found for your request.');
      }
    } catch {
      if (requestId === latestRequest.current) setError(true);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  function handleClose(): void {
    setSelectedMovie(null);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}
