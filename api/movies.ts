import axios from 'axios';
import type { Movie } from '../src/types/movie.ts';

interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
}

function errorResponse(
  error: string,
  status: number,
  headers: Record<string, string> = {},
): Response {
  return Response.json(
    { error },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...headers,
      },
    },
  );
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return errorResponse('Method not allowed.', 405, { Allow: 'GET' });
    }

    const params = new URL(request.url).searchParams;
    const query = params.get('query')?.trim() ?? '';
    const pageValue = params.get('page') ?? '1';
    const page = Number(pageValue);
    const unknownParam = [...params.keys()].some(
      (key) => key !== 'query' && key !== 'page',
    );

    if (
      !query ||
      query.length > 200 ||
      params.getAll('query').length !== 1 ||
      params.getAll('page').length > 1 ||
      !/^[1-9]\d{0,2}$/.test(pageValue) ||
      page > 500 ||
      unknownParam
    ) {
      return errorResponse('Enter a valid query and page from 1 to 500.', 400);
    }

    const token = process.env.TMDB_TOKEN?.trim();
    if (!token) {
      return errorResponse('Movie search is not configured.', 503);
    }

    try {
      const { data } = await axios.get<MovieSearchResponse>(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: { query, page, include_adult: false },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10_000,
        },
      );

      if (
        !data ||
        !Array.isArray(data.results) ||
        !Number.isInteger(data.total_pages) ||
        data.total_pages < 0
      ) {
        return errorResponse('Movie search is temporarily unavailable.', 502);
      }

      return Response.json(
        { results: data.results, total_pages: Math.min(data.total_pages, 500) },
        {
          headers: {
            'Cache-Control':
              'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    } catch {
      // Axios errors can contain request headers. Never return or log them.
      return errorResponse('Movie search is temporarily unavailable.', 502);
    }
  },
};
