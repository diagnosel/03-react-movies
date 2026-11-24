import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => Promise<void>;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  function handleSubmit(formData: FormData): void {
    const value = formData.get('query');
    const query = typeof value === 'string' ? value.trim() : '';

    if (!query) {
      toast('Please enter your search query.');
      return;
    }

    void onSubmit(query);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={css.form} action={handleSubmit}>
          <input
            className={css.input}
            type="text"
            name="query"
            aria-label="Search movies"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
