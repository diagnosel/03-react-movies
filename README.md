# Movie Search

React homework 2. Search movies with TMDB and open a movie details modal.

- [Source code](https://github.com/diagnosel/03-react-movies)
- [Live app](https://03-react-movies-plum-omega.vercel.app/)

## Run locally

Use Node.js 22 and npm. Local development uses 22.13.0, and Vercel uses Node.js 22.

1. Run `nvm use` if you use nvm. The project pins Node.js 22.13.0.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`.
4. Set `VITE_TMDB_TOKEN` to your TMDB API Read Access Token.
5. Run `npm run dev` and open the URL shown in the terminal.

Get your token from [TMDB API settings](https://www.themoviedb.org/settings/api).
Restart Vite after changing `.env`. Keep `.env` out of Git.
Vite includes `VITE_` values in the browser bundle. This setting keeps the token out of source files. It does not make it a server secret.

## How the code works

I used form actions for the search, so the input does not need its own state. I kept the movie state in `App` and passed data through props.

- `App` stores the movies, loading status, error, and selected movie.
- `SearchBar` checks the query. `fetchMovies` sends it to TMDB with Axios.
- `MovieGrid` shows posters and titles. Selecting a card opens the movie details.
- `MovieModal` uses a portal. It closes on the button, Escape, or backdrop click and restores page scrolling.

Checked: search, empty results, error state, and modal closing.

## Sources

- [TMDB docs](https://developer.themoviedb.org/reference/search-movie)
- [React Form Actions](https://react.dev/reference/react-dom/components/form)
- [Course CSS](https://github.com/goitacademy/react-movies-styles)

Deployed on Vercel.
