import tryCatch from '../../../../backend/src/utils/tryCatch.ts';
import withCache from './withCache.ts';
import LRUMap from 'mnemonist/lru-map.js';

function decode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export default withCache(new LRUMap(2 * 8), function parseJSONWebToken(token) {
  if (token) {
    const [data] = tryCatch(() => decode(token));
    return data;
  }
});
