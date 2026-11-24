# Movie Search

React homework 2. Search movies with TMDB and open a movie details modal.

- [Source code](https://github.com/AurikaSa/03-react-movies)
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

- `App` owns `movies`, `loading`, `error`, and `selectedMovie`.
- `SearchBar` reads `FormData` through `<form action={handleSubmit}>`. It trims the query, rejects blank input, and calls `onSubmit`.
- `fetchMovies(query)` sends an Axios request with the query and a Bearer token. Its typed response returns `Movie[]`.
- A new search clears the old results and error. A request counter keeps older responses from replacing the latest results.
- `MovieGrid` gets the movie list and an `onSelect` callback. A click, Enter, or Space selects a movie.
- `MovieModal` uses `createPortal` to render under `document.body`. It closes by button, Escape, or backdrop click.
- The modal effect saves the old scroll and focus state. Its cleanup removes the listener and restores both.
- `Loader` and `ErrorMessage` replace the grid during loading and errors. Empty results use React Hot Toast.

For example, searching for `Alien` updates state in `App`. Clicking a result sets `selectedMovie`. Closing the modal sets it back to `null`, so React removes the modal and runs its cleanup.

## Sources

- [Assignment](https://www.edu.goit.global/uk/learn/39153109/52167586/52168571/homework). The supplied text was used because the course page was not accessible through the web tool.
- [Course CSS Modules](https://github.com/goitacademy/react-movies-styles). All six files were copied. Small mobile rules were added to SearchBar and MovieModal.
- [User-supplied example](https://github.com/sofiiadorosh/03-react-movies). Used as a reference.
- [React Form Actions](https://react.dev/reference/react-dom/components/form).
- [TMDB movie search](https://developer.themoviedb.org/reference/search-movie).

## Checks

Run `npm run build`, `npm run lint`, and `npm run format:check`.

Validated locally on 24 November 2026:

- `npm run build`: passed with Node.js 22.13.0.
- `npm run lint`: passed.
- `npm run format:check`: passed before the final documentation update. Rechecked at delivery.
- Browser checks: passed with controlled API responses. Covered blank input, trimmed input, results, loading, empty results, HTTP 500, recovery, and overlapping searches.
- Modal checks: passed for portal rendering, movie details, Enter and Space, Escape, close button, backdrop, inside click, focus trap, focus return, and scroll restoration.
- Layout: inspected at 1200px and 390px. No horizontal overflow at 390px or 320px.
- No unexpected console errors or warnings in the checked flows. The simulated HTTP 500 produced the expected browser network error.
- Real TMDB authorization and search: passed with `Interstellar`. The API returned 20 movies on page 1, with 27 total matches at the time of the check.
- Live browser: results and the first poster loaded. The Interstellar modal showed its backdrop, overview, release date, and rating. Escape closed the modal and restored scrolling. No console errors or warnings were captured.
- The local token is stored in `.env`, with file mode `600`. `git check-ignore .env` confirms that Git ignores it. The production build reads `VITE_TMDB_TOKEN` from Vercel environment settings.

The first dependency install ran under Node 21 and skipped native bindings. Installing again with Node 22 fixed build and lint. A missing favicon caused a 404 on the first browser load. An explicit favicon fixed it. The first browser script completed its UI assertions but failed when restoring a null viewport value. The script was corrected and rerun successfully.

Browser evidence is in `output/playwright/hw2/` and is ignored by Git. The original PNG screenshots show controlled test data. `live-results.jpg` and `live-modal.jpg` show a real TMDB search.

## Delivery checklist

- [x] Vite, React, TypeScript, Axios, React Hot Toast, and modern-normalize.
- [x] Six component folders with matching `.tsx` and `.module.css` files and default exports.
- [x] Shared `Movie` interface in `src/types/movie.ts`. Local prop interfaces use the required names.
- [x] Typed service in `src/services/movieService.ts` and `VITE_TMDB_TOKEN`.
- [x] Form Actions, exact messages, conditional grid, loading, and error states.
- [x] Portal modal, close actions, scroll lock, and cleanup implemented.
- [x] Run build, lint, formatting, and browser checks with controlled API data.
- [x] Verify a real TMDB search with the user's token.
- [x] Create the public [`03-react-movies` GitHub repository](https://github.com/AurikaSa/03-react-movies).
- [x] Deploy to [Vercel](https://03-react-movies-plum-omega.vercel.app/) and verify the live page.
- [ ] Submit both links on the course portal manually. Wait at least 5 minutes after repository changes, as the assignment asks.

GitHub and Vercel publication is complete. Course submission must be done manually.

## Production checks

The public Vercel URL opens without login. Checked on 24 November 2026:

- Real searches for `Interstellar` and `Inception` show results. A new search clears the old results and shows the loading state.
- Posters and the selected movie backdrop load from TMDB.
- The modal shows the movie details. Escape closes it and restores scrolling.
- A query with no matches shows `No movies found for your request.` and leaves no old cards.
- At 390px, the page and modal fit the viewport without horizontal overflow. The temporary viewport override was reset after the check.
- No console errors or warnings were captured in these production checks.

`VITE_TMDB_TOKEN` is configured in the Vercel Production environment. The local `.env` and generated files are excluded from GitHub and Vercel source uploads.

This project was deployed through Vercel CLI. GitHub is not connected to automatic Vercel deployments. To publish later changes, run `vercel deploy --prod --scope zendaya` from this project after updating GitHub.
