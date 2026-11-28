# Movie Search

React homework 2. Search movies with TMDB and open a movie details modal.

- [Source code](https://github.com/diagnosel/03-react-movies)
- [Live app](https://03-react-movies-plum-omega.vercel.app/)

## Run locally

Use Node.js 22, npm and the [Vercel CLI](https://vercel.com/docs/cli).

1. Run `nvm use` if you use nvm. The project pins Node.js 22.13.0.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`.
4. Set `TMDB_TOKEN` to your TMDB API Read Access Token.
5. Run `npm run dev:full` and open http://localhost:3001.

This command runs Vite and the `/api/movies` function together. `npm run dev` and `npm run preview` serve only the frontend and do not run the API.

Get your token from [TMDB API settings](https://www.themoviedb.org/settings/api). Keep `.env` out of Git. The server reads `TMDB_TOKEN`; no public `VITE_` token is used.

## How the code works

The search uses form actions, so the input does not need its own state. `App` owns the movie state and passes data through props.

- `App` stores the movies, loading status, error, and selected movie.
- `SearchBar` checks the query. `fetchMovies` uses Axios to call `/api/movies`. The server calls a fixed TMDB URL and adds the token.
- `MovieGrid` shows posters and titles. Selecting a card opens the movie details.
- `MovieModal` uses a portal. It closes on the button, Escape, or backdrop click and restores page scrolling.

## Server token protection

The Vercel function uses the server-only `TMDB_TOKEN` Secret. The browser does not send the TMDB Authorization header. The service still returns the movie array expected by `App`; this homework does not add pagination or TanStack Query.

The API accepts only GET with a bounded query and optional page. It has a fixed upstream destination, a 10-second timeout, short success caching and safe errors. Error responses do not include request headers or Axios error details. The search endpoint remains public and does not add user authentication or rate limiting.

The previously exposed token has been replaced. TMDB accepted the new token (HTTP 200) and rejected the previous token (HTTP 401). Old builds may still contain the revoked value, but it no longer authenticates.

## Checks

Verified on 2026-11-28:

- All 9 server proxy tests passed.
- TypeScript/build, lint and formatting checks passed.
- Live mobile and desktop search and the movie modal worked. Empty queries did not send requests. No normal-flow console errors or warnings were captured.
- Live API checks passed for search (200), invalid input (400) and unsupported methods (405).
- Browser requests used `/api/movies` without an Authorization header. No direct browser request went to the TMDB API.
- The actual token was absent from the current public JavaScript and checked API responses for both `03-react-movies` and `04-react-query`.

Both projects were deployed with the new server Secret on 2026-11-28. Live search, the movie modal and the public asset checks passed after rotation. The old unused VITE_TMDB_TOKEN variable was removed from Production with approval. The server TMDB_TOKEN Secret remains. A live search check passed after removal.

Run `npm test`, `npm run build`, `npm run lint` and `npm run format:check`. The tests use Node.js's built-in runner. Node.js 22.13 prints an experimental warning for TypeScript stripping.

## Sources

- [TMDB docs](https://developer.themoviedb.org/reference/search-movie)
- [React Form Actions](https://react.dev/reference/react-dom/components/form)
- [Course CSS](https://github.com/goitacademy/react-movies-styles)

Deployed on Vercel.
