import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import axios from 'axios';
import proxy from '../api/movies.ts';

const originalToken = process.env.TMDB_TOKEN;
const movie = {
  id: 1,
  title: 'Example movie',
  poster_path: null,
  backdrop_path: null,
  overview: 'Example overview',
  release_date: '2026-01-01',
  vote_average: 8,
};
let upstream;

beforeEach(() => {
  process.env.TMDB_TOKEN = 'test-only-server-token';
  upstream = mock.method(axios, 'get', async () => ({
    data: { results: [movie], total_pages: 3, internal: 'not for the browser' },
  }));
});

afterEach(() => {
  mock.restoreAll();
  if (originalToken === undefined) delete process.env.TMDB_TOKEN;
  else process.env.TMDB_TOKEN = originalToken;
});

function request(params = 'query=batman&page=2', options) {
  return new Request(`https://example.test/api/movies?${params}`, options);
}

test('forwards only allowed parameters to a fixed TMDB URL with a server token', async () => {
  const response = await proxy.fetch(request());
  assert.equal(response.status, 200);
  const [url, options] = upstream.mock.calls[0].arguments;
  assert.equal(url, 'https://api.themoviedb.org/3/search/movie');
  assert.deepEqual(options.params, {
    query: 'batman',
    page: 2,
    include_adult: false,
  });
  assert.equal(options.headers.Authorization, 'Bearer test-only-server-token');
  assert.equal(options.timeout, 10_000);
  assert.deepEqual(await response.json(), { results: [movie], total_pages: 3 });
  assert.match(response.headers.get('Cache-Control'), /s-maxage=60/);
  assert.equal(response.headers.get('Authorization'), null);
});

test('defaults to page 1 and trims the search query', async () => {
  assert.equal((await proxy.fetch(request('query=%20batman%20'))).status, 200);
  assert.equal(upstream.mock.calls[0].arguments[1].params.page, 1);
  assert.equal(upstream.mock.calls[0].arguments[1].params.query, 'batman');
});

test('rejects empty, long, repeated or unsupported input before contacting TMDB', async () => {
  const invalid = [
    '',
    'query=%20',
    `query=${'x'.repeat(201)}`,
    'query=batman&page=0',
    'query=batman&page=-1',
    'query=batman&page=1.5',
    'query=batman&page=501',
    'query=batman&page=abc',
    'query=batman&page=1&page=2',
    'query=one&query=two',
    'query=batman&url=https://example.org',
    'query=batman&api_key=other',
  ];
  for (const params of invalid) {
    const response = await proxy.fetch(request(params));
    assert.equal(response.status, 400, params);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(upstream.mock.callCount(), 0);
});

test('rejects methods other than GET', async () => {
  const response = await proxy.fetch(
    request('query=batman', { method: 'POST' }),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'GET');
  assert.equal(upstream.mock.callCount(), 0);
});

test('fails safely when the server token is missing', async () => {
  delete process.env.TMDB_TOKEN;
  const response = await proxy.fetch(request());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: 'Movie search is not configured.',
  });
  assert.equal(upstream.mock.callCount(), 0);
});

test('does not return upstream error details or credentials', async () => {
  upstream.mock.mockImplementation(async () => {
    throw new Error('Authorization: Bearer test-only-server-token');
  });
  const response = await proxy.fetch(request());
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: 'Movie search is temporarily unavailable.',
  });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('preserves an empty results page', async () => {
  upstream.mock.mockImplementation(async () => ({
    data: { results: [], total_pages: 0 },
  }));
  const response = await proxy.fetch(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { results: [], total_pages: 0 });
});

test('rejects an invalid upstream response', async () => {
  upstream.mock.mockImplementation(async () => ({
    data: { error: 'test-only-server-token' },
  }));
  const response = await proxy.fetch(request());
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: 'Movie search is temporarily unavailable.',
  });
});

test('limits pagination to the 500 pages supported by the proxy', async () => {
  upstream.mock.mockImplementation(async () => ({
    data: { results: [movie], total_pages: 900 },
  }));
  const response = await proxy.fetch(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).total_pages, 500);
});
