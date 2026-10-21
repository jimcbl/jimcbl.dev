import assert from 'node:assert/strict';
import test from 'node:test';
import { galleryPhotos, fetchLatestPhotos, applyPhotoCaptions } from '../src/lib/unsplash.ts';

const photo = { id: 'example', width: 1200, height: 800, alt_description: 'A street at dusk', urls: { regular: 'https://images.unsplash.com/photo-example?ixid=tracking' }, links: { html: 'https://unsplash.com/photos/example' } };

test('preserves hotlinked CDN URLs, attribution links, aspect ratios, and API order', () => {
  const items = galleryPhotos([photo, { ...photo, id: 'second', width: 800, height: 1200 }]);
  assert.deepEqual(items.map(item => item.id), ['example', 'second']);
  assert.equal(items[0].imageUrl, photo.urls.regular);
  assert.equal(items[1].height, 1200);
  assert.equal(new URL(items[0].photoUrl).searchParams.get('utm_source'), 'jimcbl.dev');
});

test('filters broken images, unsafe links, duplicates, and supplies missing alt text', () => {
  const items = galleryPhotos([photo, photo, { ...photo, id: 'bad', width: 0 }, { ...photo, id: 'unsafe', links: { html: 'javascript:alert(1)' } }, { ...photo, id: 'no-alt', alt_description: null }]);
  assert.equal(items.length, 2);
  assert.equal(items[1].alt, 'A photograph by Thinh Tran');
});

test('fetches latest profile uploads with a server-side header and an hourly cache', async () => {
  const items = await fetchLatestPhotos('test-key', async (url, options) => {
    assert.equal(new URL(url).pathname, '/users/jimcbl/photos');
    assert.equal(new URL(url).searchParams.get('order_by'), 'latest');
    assert.equal(options.headers.Authorization, 'Client-ID test-key');
    assert.equal(options.next.revalidate, 3600);
    assert.ok(options.signal);
    return Response.json([photo]);
  });
  assert.equal(items.length, 1);
});

test('falls back for missing credentials, rate limits, network errors, empty or malformed responses', async () => {
  assert.equal(await fetchLatestPhotos('', () => { throw new Error('Must not fetch without a key'); }), null);
  for (const fetcher of [
    async () => new Response('', { status: 429 }),
    async () => { throw new Error('Network failure'); },
    async () => Response.json([]),
    async () => Response.json({ errors: ['Invalid key'] }),
    async () => new Response('invalid json'),
  ]) assert.equal(await fetchLatestPhotos('test-key', fetcher), null);
});


test('uses authored captions independently of alt text, and preserves them across reordering', () => {
  const photos = galleryPhotos([photo, { ...photo, id: 'second', alt_description: null }]);
  const overrides = { example: { caption: 'Evening light.', alt: 'Do not replace existing alt text' }, second: { caption: 'A quiet street.', alt: 'A narrow cobbled street between old houses' } };
  const edited = applyPhotoCaptions(photos, overrides);
  assert.equal(edited[0].caption, 'Evening light.');
  assert.equal(edited[0].alt, 'A street at dusk');
  assert.equal(edited[1].alt, 'A narrow cobbled street between old houses');
  assert.equal(applyPhotoCaptions([...photos].reverse(), overrides)[0].caption, 'A quiet street.');
});

test('new photos use their Unsplash description, then alt text, until given a custom caption', () => {
  const [authored] = galleryPhotos([{ ...photo, description: 'A summer evening.' }]);
  assert.equal(applyPhotoCaptions([authored], {})[0].caption, 'A summer evening.');
  const [automatic] = galleryPhotos([photo]);
  assert.equal(automatic.caption, 'A street at dusk');
});
